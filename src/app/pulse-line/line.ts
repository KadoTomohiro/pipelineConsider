import {map, Observable, OperatorFunction} from "rxjs";
import {Tank} from "./tank";

export class Line<T, U> {
  constructor(private source: Observable<T>, private transformer: OperatorFunction<T, U>) {}

  /**
   * Connects the line to a tank.
   * @param tank The tank to connect to.
   */
  connect(tank: Tank<U>): void {
    this.source.pipe(this.transformer).subscribe((value) => {
      tank.input(value);
    });
  }
}
