import {Tank} from "./tank";
import {Observable, Observer, Subject, Subscription} from "rxjs";

/**
 * タンクへのデータ投入口
 */
export class Inlet<T> {
  private subscription: Subscription;
  constructor(source: Observable<T>, private tankObserver: Observer<T>, handlerOption: Partial<Observer<T>> = {}) {
    const inletObserver = Object.assign({}, tankObserver, handlerOption)
    this.subscription = source.subscribe(inletObserver);
  }

  reject() {
    this.subscription.unsubscribe();
  }

}
