import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  clearSearch,
  getAllBooks,
  getBooksLoaded,
  searchBooks,
} from '@tmo/books/data-access';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({ initialState: { books: { entities: [] } } }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getAllBooks, []);
    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('formatDate() should return formatted date of format M/DD/YYYY and undefined when empty string is passed ', () => {
    let formattedDate = component.formatDate('08/18/2022');
    expect(formattedDate).toBe('8/18/2022');
    formattedDate = component.formatDate('');
    expect(formattedDate).toBeUndefined();
  });

  it('searchExample() should search books with example search term', fakeAsync(() => {
    component.searchExample();
    fixture.detectChanges();
    tick(500);
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'javascript' })
    );
  }));

  it('should search books with search term', fakeAsync(() => {
    component.searchForm.controls.term.setValue('python');
    tick(500);
    store.overrideSelector(getBooksLoaded, true);
    store.refreshState();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'python' })
    );
  }));

  it('should clear the search if books with the search term does not exists', fakeAsync(() => {
    component.searchForm.controls.term.setValue('');
    tick(500);
    expect(store.dispatch).toHaveBeenCalledWith(clearSearch());
  }));
});
