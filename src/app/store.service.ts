import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ActivatedRoute} from "@angular/router";

type Store = {
  value: string
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  storeSubject: BehaviorSubject<Store | null> = new BehaviorSubject<Store | null>(null);
  store$ = this.storeSubject.asObservable();
  constructor(
  ) {
    this.storeSubject
  }

  update(value: string) {
    this.storeSubject.next({value});
  }

  get currentValue(): string | null {
    return this.storeSubject.value?.value ?? null;
  }
}
