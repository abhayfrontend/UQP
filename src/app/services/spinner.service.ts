import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SpinnerService {

	private status = new Subject<boolean>();

	status$ = this.status.asObservable();

  start(): void {
    this.status.next(true);
  }

  stop(): void {
    this.status.next(false);
  }

}
