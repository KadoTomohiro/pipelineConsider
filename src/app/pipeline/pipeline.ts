import {BehaviorSubject, Observable, Observer, OperatorFunction, Subscription, take, tap,} from "rxjs";

type OutletPattern = {[key: string]: unknown};

type Outlets<T extends OutletPattern | undefined> = T extends OutletPattern ? {
  [K in keyof T ]: Observable<T[K]>
}  :  undefined

type OutletOptions<T, O extends OutletPattern | undefined> = O extends OutletPattern ? {[key in keyof O]: OperatorFunction<T, O[key]>} : undefined

type DefaultSnapShot<T> = { default: T }
type DefaultOutlet<T> = Outlets<DefaultSnapShot<T>>


export class Pipeline<T, O extends OutletPattern | undefined = undefined> {

  /**
   * 初期データ。リセット時に使用する。
   * @private
   */
  private readonly initialData: T;

  /** 各アウトレットのスナップショットデータを保持するオブジェクト */
  private snapshotStock = {} as DefaultSnapShot<T> & O;
  /** データを保持するSubject */
  private readonly _storeSource: BehaviorSubject<T>;

  /** インレットの購読を保持するオブジェクト */
  private inletSubscriptions: Record<string, Subscription> = {};

  /**
   * 各アウトレットのストリームを保持するオブジェクト
   */
  public outlets: DefaultOutlet<T> & Outlets<O>;
  /**
   * 各アウトレットのスナップショットを保持するオブジェクト
   */
  public snapshot: DefaultSnapShot<T> & O = new Proxy(this.snapshotStock, {
    get: (target, property: string) => {
      if (property in target) {
        return target[property];
      } else {
        return undefined
      }
    }
  });
  /**
   * 各アウトレットのストリームを一度だけ購読するためのオブジェクト
   */
  public oneTimeOutlets: DefaultOutlet<T> & Outlets<O>;

  constructor(
    initialData: T,
    options: { outlets?: OutletOptions<T, O> }
  ) {
    this.initialData = initialData;
    this._storeSource = new BehaviorSubject<T>(this.initialData);

    if (options.outlets) {
      this.outlets = {} as typeof this.outlets;
      const outlets = options.outlets;
      const outletKeys:  string[] = Object.keys(options.outlets)

      outletKeys.forEach(key => {
        const outlet = outlets[key];
        this.outlets[key] = this._storeSource.pipe(
          outlet,
          tap(value => {
            this.snapshotStock[key] = value;
          })
        );
      })
      this.outlets.default = this._storeSource.pipe(
        tap(value => {
            this.snapshotStock.default = value;
          }
        ));
    } else {
      this.outlets = undefined as unknown as typeof this.outlets;
    }

    this.oneTimeOutlets = new Proxy(this.outlets, {
      get: (target, property: string) => {
        if (property in target) {
          return target[property].pipe(take(1));
        } else {
          return undefined
        }
      }
    })
  }


  /**
   * インレットを追加する
   * @param key インレットのキー
   * @param inlet インレットのストリーム
   * @param connectionType インレットの接続タイプ。接続するObsreverメソッドを指定する。省略した場合はnextのみ接続する。
   */
  addInlet(key: string, inlet: Observable<T>, connectionType: { [key in keyof Observer<unknown>]: boolean } = {next: true, error: false, complete: false}): void {
    const entries = Object.keys(connectionType)
      .filter((key): key is keyof Observer<unknown> => connectionType[key as keyof Observer<unknown>])
      .map((key) => {
        return [key, this._storeSource[key].bind(this._storeSource)]
      });
    const observer = Object.fromEntries(entries)
    this.inletSubscriptions[key] = inlet.subscribe(observer);
  }

  /**
   *
   */
  destroy(): void {
    Object.values(this.inletSubscriptions)
      .forEach(subscription => subscription.unsubscribe());
    this._storeSource.complete();
  }

  /**
   * インレットを削除する
   * @param key インレットのキー
   */
  removeInlet(key: string): void {
    this.inletSubscriptions[key].unsubscribe();
  }

  /**
   * パイプラインのデータを更新する
   * @param data 更新するデータ
   */
  update(data: T): void {
    this._storeSource.next(data);
  }

  /**
   * パイプラインをリセットする
   * @param resetData リセット時に使用するデータ。省略した場合は初期データが使用される。
   */
  reset(resetData?: T): void {
    this.update(resetData ?? this.initialData);
  }
}
