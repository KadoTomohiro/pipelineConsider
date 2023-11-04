import { Component } from '@angular/core';
import {StoreService} from "./store.service";
import {HttpClient} from "@angular/common/http";
import {from, interval, map, mergeMap, of, pipe, take, timeout, timer} from "rxjs";
import {Pipeline} from "./pipeline/pipeline";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pipelineConsider';

  pipeline: Pipeline<string, {foo: string, bar: number}>

  constructor(
    private store: StoreService,
    private http: HttpClient
  ) {
    this.store.update('hello');
    this.multiple()

    this.pipeline = new Pipeline<string, {foo: string, bar: number}>({
      initialData: 'hello',
      outlets:{
        foo: pipe(map((value: string | null) => value + ' world')),
        bar: pipe(map((value: string | null) => value?.length ?? 0))
      }
    })

    const defaultValue = this.pipeline.snapshot.default;
    const foo = this.pipeline.snapshot.foo;
    const bar = this.pipeline.snapshot.bar;

    const default$ = this.pipeline.outlets.default;
    const foo$ = this.pipeline.outlets.foo;
    const bar$ = this.pipeline.outlets.bar;

    this.pipeline.oneTimeOutlets.default.subscribe((value) => {
      console.log('oneTime default')
      console.log(value)
    })

    this.pipeline.outlets.default.subscribe((value) => {
      console.log('outlets default')
      console.log(value)
    })

  }

  multiple() {
    const multiplicandSource$ = from([1, 2, 3])
    const multiplierSource$ = of(3)

    multiplierSource$.pipe(
      mergeMap(multiplier => {
        return multiplicandSource$.pipe(
          map(multiplicand => multiplicand * multiplier)
        )
      })
    ).subscribe(console.log)
  }

  send() {
    this.pipeline.update('Bonjour')
  }

  getValue() {
    const currentValue = this.store.currentValue
    console.log(currentValue)
    this.store.update(currentValue+ ' world');
  }

  addInlet() {
    const interval$ = interval(1000).pipe(
      map((value) => value.toString()),
      take(10)
    )
    this.pipeline.addInlet('foo', interval$, {next: true, error: false, complete: true})
  }
}
