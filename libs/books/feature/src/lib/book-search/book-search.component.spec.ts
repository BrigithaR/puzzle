import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '@tmo/books/feature';
import { BookSearchComponent } from './book-search.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  addToReadingList,
  getAllBooks,
  removeFromReadingList,
} from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';
import { OverlayContainer } from '@angular/cdk/overlay';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;
  let oc: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let spyTest: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [
        provideMockStore({ initialState: { books: { entities: [] } } }),
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    oc = TestBed.inject(OverlayContainer);
    overlayContainerElement = oc.getContainerElement();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store.overrideSelector(getAllBooks, []);
    spyTest = spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
  it('should show when book added to reading list and when clicked on undo should call removeFromReadingList', () => {
    const book: Book = createBook('A');
    component.addBookToReadingList(book);
    const undoButton: HTMLElement = overlayContainerElement.querySelector(
      '.mat-simple-snackbar-action > button'
    );
    undoButton?.click();
    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book }));
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(spyTest).toHaveBeenCalledWith(
      removeFromReadingList({ item: { ...book, bookId: 'A' } })
    );
  });
});
