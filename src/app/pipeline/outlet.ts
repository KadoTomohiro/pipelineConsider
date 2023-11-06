import {Observable, OperatorFunction, take, tap} from "rxjs";

export class Outlet<I, O> {

  stream: Observable<O>;
  snapshot: O | undefined;
  ontime: Observable<O>;

  constructor(tank: Observable<I>, pipe: OperatorFunction<I, O>, ) {
    this.stream = tank.pipe(
      pipe,
      tap(snapshot => this.snapshot = snapshot)
    );
    this.ontime = this.stream.pipe(
      take(1)
    );
  }

  }
}
