import {Observable, OperatorFunction} from "rxjs";

export interface PipeLine<T, O extends Record<`${string}$`, unknown>> {
  new (
    initialData: T,
    options: {
      outlets?: Record<keyof O, OperatorFunction<T | null, O>>
    }
  ): PipeLine<T, O>;

  outlets: {default$: Observable<T | null>} & Record<keyof O, Observable<O[keyof O]>>

  addInlet<T>(key: string, inlet: Observable<T>): void;
  removeInlet(key: string): void;

  update(data: T): void;
  get(): T | null;
  reset(): void;

  destroy(): void;
}
