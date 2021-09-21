import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { Book, ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { TypedAction } from '@ngrx/store/src/models';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book ,add:false})),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item, remove:false })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  showSnackBarOnAdd$=createEffect(()=>
  this.actions$.pipe(
    ofType(ReadingListActions.confirmedAddToReadingList),
    tap((action)=>{
      if(action.add===false){
        const typeItem:ReadingListItem={
          ...action.book,
          bookId:action.book.id
        }
        this.openSnackBar(
          `Added ${action.book.title} to reading list`,ReadingListActions.removeFromReadingList({item:typeItem,remove:false})
        )
      }
    })
  ),{dispatch:false}
  );

  showSnackBarOnRemove$=createEffect(()=>
     this.actions$.pipe(
       ofType(ReadingListActions.confirmedRemoveFromReadingList),
       tap((action)=>{
         if(action.remove===false){
             const typeBook:Book={
               id:action.item.bookId,
               ...action.item
             }
             this.openSnackBar(
               `Removed ${action.item.title} from reading list`,ReadingListActions.addToReadingList({book:typeBook,add:false})
             )
         }
       })
     ),{dispatch:false}
  )

  openSnackBar(message:string,action:TypedAction<string>){
    this.snackBar.open(message,'Undo',{duration:3000})
    .onAction()
    .subscribe(()=>{
      this.store.dispatch(action);
    })
  }

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private snackBar:MatSnackBar, private store:Store) {}

}
