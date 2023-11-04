import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {concatWith, mergeMap, Observable} from 'rxjs';
import {StoreService} from "./store.service";

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor(
    private store: StoreService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return this.store.store$.pipe(
      mergeMap(store => {
        const value = store?.value ?? '';

        request = request.clone({
          setHeaders: {
            'X-Store': value
          }
        });

        return next.handle(request);
      })
    )}
}
