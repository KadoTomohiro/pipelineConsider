import { Component } from '@angular/core';
import {from, map, Observable} from 'rxjs';
import {Outlet, Pipeline} from "./pipeline/pipeline";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pipelineConsider';

  constructor() {
    const pipeline: Pipeline<string, {initial$: string} > = new Pipeline<string, {initial$: string}>(null, undefined, {
      initial$: [
        map((s: string | null) => s + 'a'),
      ],
    })

    pipeline.outlets.default$

    const o: Outlet = {
        initial$: from(['a', 'b', 'c']),
    }
  }
}
