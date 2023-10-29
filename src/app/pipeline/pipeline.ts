import {BehaviorSubject, Observable, OperatorFunction, switchMap} from "rxjs";

type DefaultOutlet<T> = {
  default: T
}

type ObservablePropertyName = `${string}$`

type OperatorFunctionArray<T, O extends Outlet> = [
  OperatorFunction<T | null, O[keyof O]>,
] | [
  OperatorFunction<T | null, unknown>,
  OperatorFunction<unknown, O[keyof O]>
] | [
  OperatorFunction<T | null, unknown>,
  ...OperatorFunction<unknown, unknown>[],
  OperatorFunction<unknown, O[keyof O]>
]

export type Outlet = {
  [key: ObservablePropertyName]: unknown
}

/** 特定の型のデータを、Observableストリームとして保持する。 */
export class Pipeline<T, O extends Outlet> {

  /** データを保持するSubject */
  private _storeSource: BehaviorSubject<T | null>;
  /** データを配信するストリーム */
  public store$: Observable<T | null>;


  outlets:
    Readonly<{default$: Observable<T | null>} & {[key in keyof O]: Observable<O[key]>}>;
  constructor(
    initialValue: T | null = null,
    private outsideStore$?: Observable<T | null>,
    outlets?:  {[key in keyof O]: OperatorFunctionArray<T, O>}
  ) {
    this._storeSource = new BehaviorSubject<T | null>(initialValue);
    this.store$ = this._storeSource.asObservable();
    this.outsideStore$?.subscribe(this._storeSource);

    if (outlets) {
      const optionalOutlets: {[key in keyof O]?: Observable<O[key]>} = {}
    }

    // outletと同じキーを持ち、値がObservableであるプロパティを持つオブジェクトを作成する
    Object.keys(outlets).forEach((key: keyof O) => {
      const outlet = outlets[key];
      const outlet$ = this.store$.pipe(
        ...outlet
      );
      optionalOutlets[key] = outlet$;
    }


    this.outlets = {
      default$: this.store$
    }

  }

  /**
   * データを更新する
   */
  public update(data: T) {
    this._storeSource.next(data);
  }

  /**
   * 現在のデータを同期的に取得する
   */
  public get(): T | null {
    return this._storeSource.getValue();
  }

  getInitial(name: string | undefined): string {
    if (this.isString(name)) {
      // undefinedの場合は処理がここまで進まないので、nameは確実にstringであるといえる
      return name.substr(1);
    }
    return ''
  }


  isString(arg: string | number | undefined): arg is string {
    return typeof arg === 'number';
  }

  /**
   * 現在のデータを非同期的に取得する
   */
  public getAsync(): Observable<T | null> {
    return this.store$;
  }

  /**
   * データを削除する
   */
  public delete() {
    this._storeSource.next(null);
  }

  mapToObsebavle(obj, fn) {
    Object.fromEntries(Object.entries(obj).map(fn));
  }

}
