import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import {
  createBook,
  createReadingListItem,
  SharedTestingModule,
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ReadingListEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', (done) => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it('should mark book as read', (done) => {
      actions = new ReplaySubject();
      const item = createReadingListItem('A');
      const book = createBook('A');
      actions.next(ReadingListActions.markBookAsRead({ book: item }));
      effects.markBookAsRead$.subscribe(() => {
        expect(item.bookId).toEqual(
          ReadingListActions.confirmedMarkBookAsRead({ book }).book.id
        );
        done();
      });
      httpMock.expectOne('/api/reading-list/A/finished').flush([]);
    });
  });

  it('should invoke failedMarkAsRead when failed to mark book as read', (done) => {
    actions = new ReplaySubject();
    const item = createReadingListItem('A');
    actions.next(ReadingListActions.markBookAsRead({ book: item }));
    effects.markBookAsRead$.subscribe((action) => {
      expect(action).toEqual(
        ReadingListActions.failedMarkBookAsRead({ error: 'Http failure response for /api/reading-list/A/finished: 0 ' })
      );
      done();
    });
    httpMock
      .expectOne('/api/reading-list/A/finished').error(new ErrorEvent('error'))
  });
});
