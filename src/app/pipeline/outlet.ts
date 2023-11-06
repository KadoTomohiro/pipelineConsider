import {Observable, take, tap} from "rxjs";
import {PipelineConnectionError} from '../pulse-line/pipeline-connection-error';

export class Outlet<T> {

  private _stream: Observable<T> | undefined
  private _snapshot: T | undefined;
  private _onTime: Observable<T> | undefined;

  get stream(): Observable<T> {
    if (!this._stream) {
      throw new PipelineConnectionError();
    }
    return this._stream;
  }
  get snapshot(): T {
    if (!this._snapshot) {
      throw new PipelineConnectionError();
    }
    return this._snapshot;
  }

  get onTime(): Observable<T> {
    if (!this._onTime) {
      throw new PipelineConnectionError();
    }
    return this._onTime;
  }

  constructor(pipe?: Observable<T>) {
    if (pipe) {
      this.connectPipe(pipe);
    }
  }

  connectPipe(pipe: Observable<T>): void {
    this._stream = pipe.pipe(
      tap(snapshot => this._snapshot = snapshot)
    );
    this._onTime = this._stream.pipe(
        take(1)
    );
  }
}
