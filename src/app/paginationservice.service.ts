import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, scan, take, tap } from 'rxjs';

import {
  Firestore,
  collection,
  orderBy,
  query,
  limit,
  startAfter,
  DocumentData,
  Query,
  collectionSnapshots,
  collectionData,
  where,
} from '@angular/fire/firestore';

interface QueryConfig {
  // type:string, // Onli Offl Both

  path: string; //  path to collection
  field: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order?
  prepend: boolean; // prepend to source?
}

@Injectable({
  providedIn: 'root',
})
export class PaginationserviceService {
  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query!: QueryConfig;

  // Observable data
  dataO!: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  firstHit = false;

  constructor(private fs: Firestore) {}

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults

  init(
    // type:string,
    path: string,
    field: string,
    opts?: any,
    sectionname?:string,
    parameter?: any,
    operator?: any,
    value?: any

  ) {
    //this.firstHit = true;
    this._done.next(false);
    this._loading.next(false);
    this._data.next([]);

    this.done = this._done.asObservable();
    this.loading = this._loading.asObservable();
    this.dataO = of();

    this.query = {
      // type,
      path,
      field,
      limit: 10,
      reverse: false,
      prepend: false,
      ...opts,
    };
    const c = collection(this.fs, this.query.path);
    let first;

    if(sectionname == 'Orders'){
    if (
      parameter != undefined &&
      parameter != '' &&
      operator != undefined &&
      operator != '' &&
      value != undefined &&
      value != ''
    ) {
      first = query(
        c,
        where("type", "array-contains", "addORDER"),
        where(parameter, operator, value),
        orderBy(this.query.field, 'desc'),
        limit(this.query.limit)
      );
    } else {
      first = query(
        c,
        where("type", "array-contains", "addORDER"),
        orderBy(this.query.field, 'desc'),
        limit(this.query.limit)
      );
    }
  }
  else {
    if (
      parameter != undefined &&
      parameter != '' &&
      operator != undefined &&
      operator != '' &&
      value != undefined &&
      value != ''
    ) {
      first = query(
        c,
        where(parameter, operator, value),
        orderBy(this.query.field, 'desc'),
        limit(this.query.limit)
      );
    } else {
      first = query(
        c,
        orderBy(this.query.field, 'desc'),
        limit(this.query.limit)
      );
    }
  }

    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.dataO = this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  // Retrieves additional data from firestore
  more(parameter?: any, operator?: any, value?: any) {
    const cursor = this.getCursor();
    if (cursor) {
      const c = collection(this.fs, this.query.path);

      let more;
      if (
        parameter != undefined &&
        parameter != '' &&
        operator != undefined &&
        operator != '' &&
        value != undefined &&
        value != ''
      ) {
        more = query(
          c,
          where(parameter, operator, value),
          orderBy(this.query.field, 'desc'),
          limit(this.query.limit),
          startAfter(cursor)
        );
      } else {
        more = query(
          c,
          orderBy(this.query.field, 'desc'),
          limit(this.query.limit),
          startAfter(cursor)
        );
      }

      this.mapAndUpdate(more);
    }
  }

  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current: any = this._data?.value;
    // const checkLink = this.resource.router.url;
    // || checkLink == '/New_home'
    // if (current.length && (checkLink == '/burn' || checkLink == '/New_home')) {

    if (current.length) {
      return this.query.prepend
        ? current[0].docX
        : current[current.length - 1].docX;
    }
    return null;
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: Query<DocumentData>) {
    if (this._done.value || this._loading.value) {
      return;
    } else {
      // loading
      this._loading.next(true);

      // Map snapshot with doc ref (needed for cursor)
      return collectionSnapshots(col)
        .pipe(
          tap((arr: any) => {
            let values = arr.map((snap: any) => {
              const data = snap.data(); //.payload.doc.data()
              const docX = snap; //.payload.doc
              return { ...data, docX };
            });

            // loading
            this._loading.next(true);

            // Map snapshot with doc ref (needed for cursor)
            return collectionSnapshots(col)
              .pipe(
                tap((arr: any) => {
                  let values = arr.map((snap: any) => {
                    const data = snap.data(); //.payload.doc.data()
                    const docX = snap; //.payload.doc
                    return { ...data, docX };
                  });

                  // If prepending, reverse the batch order
                  values = this.query.prepend ? values.reverse() : values;

                  // update source with new values, done loading
                  this._data.next(values);
                  this._loading.next(false);

                  // no more values, mark done
                  if (!values.length) {
                    this._done.next(true);
                  }
                })
              )
              .pipe(take(1))
              .subscribe();

            // update source with new values, done loading
            this._data.next(values);
            this._loading.next(false);

            // no more values, mark done
            if (!values.length) {
              this._done.next(true);
            }
          })
        )
        .pipe(take(1))
        .subscribe();
    }

    /*
  return col.pipe(
    tap((arr:any) => {
      let values = arr.map((snap:any) => {
        const data = snap.payload.doc.data()
        const doc = snap.payload.doc
        return { ...data, doc }
      })

      // If prepending, reverse the batch order
      values = this.query.prepend ? values.reverse() : values
      // update source with new values, done loading
      this._data.next(values)
      this._loading.next(false)
      // no more values, mark done
      if (!values.length) {
        this._done.next(true)
      }
  })
  ).pipe(take(1)).subscribe()
  */
  }
}
