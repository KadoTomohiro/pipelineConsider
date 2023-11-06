import {BehaviorSubject} from "rxjs";

export class Tank<T> {
  private stateSubject: BehaviorSubject<T>;

  get state$() {
    return this.stateSubject.asObservable();
  }

  constructor(initialState: T) {
    this.stateSubject = new BehaviorSubject<T>(initialState);
  }

  input(value: T) {
    this.stateSubject.next(value);
  }
}
