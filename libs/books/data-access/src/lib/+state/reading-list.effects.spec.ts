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
    it('should load reading list', (done) => {
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

    it('should fail to load reading list', (done) => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());
      const failureError = ReadingListActions.loadReadingListError(
        new ErrorEvent('error')
      );
      effects.loadReadingList$.subscribe((action) => {
        expect(action.type).toEqual(failureError.type);
        done();
      });
      httpMock.expectOne('/api/reading-list').error(new ErrorEvent('error'));
    });

    it('should add book to reading list', (done) => {
      actions = new ReplaySubject();
      actions.next(
        ReadingListActions.addToReadingList({ book: createBook('A') })
      );
      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({
            book: createBook('A'),
          })
        );
        done();
      });
      httpMock.expectOne('/api/reading-list').flush({ book: createBook('A') });
    });

    it('should remove book from reading list', (done) => {
      actions = new ReplaySubject();
      actions.next(
        ReadingListActions.removeFromReadingList({
          item: createReadingListItem('A'),
        })
      );
      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({
            item: createReadingListItem('A'),
          })
        );
        done();
      });
      httpMock
        .expectOne('/api/reading-list/A')
        .flush({ item: createReadingListItem('A') });
    });

    it('should throw error when api fails when trying to add book to reading list', (done) => {
      actions = new ReplaySubject();
      actions.next(
        ReadingListActions.addToReadingList({ book: createBook('A') })
      );

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedAddToReadingList({ book: createBook('A') })
        );
        done();
      });
      httpMock
        .expectOne(`/api/reading-list`)
        .flush(createBook('A'), { status: 400, statusText: 'Bad Request' });
    });

    it('should throw error when api fails when trying to remove book from reading list', (done) => {
      actions = new ReplaySubject();
      actions.next(
        ReadingListActions.removeFromReadingList({
          item: createReadingListItem('A'),
        })
      );
      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedRemoveFromReadingList({
            item: createReadingListItem('A'),
          })
        );
        done();
      });
      httpMock
        .expectOne('/api/reading-list/A')
        .flush(createReadingListItem('A'), {
          status: 400,
          statusText: 'Cannot remove from Reading list',
        });
    });
  });
});
