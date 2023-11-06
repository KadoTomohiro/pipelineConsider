import {Observable, take, tap} from "rxjs";

export class Outlet<T> {

  private readonly source: Observable<T>;
  private lastValue: T | undefined;

  constructor(source: Observable<T>) {
    this.source = source.pipe(
      tap(snapshot => this.lastValue = snapshot)
    );
  }

  get stream(): Observable<T> {
    return this.source;
  }

  get snapshot(): T {
    if (this.lastValue === undefined) {
      throw new Error("The pulse has not reached the outlet.");
    }
    return this.lastValue;
  }

  get oneTimeStream(): Observable<T> {
    return this.source.pipe(take(1));
  }
}
