import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { UncaughtErrorEvent } from '../classes/events/uncaught-error-event';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService implements ErrorHandler {

  constructor() { }

  public handleError(error: any): void {
    if(error instanceof HttpErrorResponse) {
      if(error.status === 0) {
        document.body.dispatchEvent(new UncaughtErrorEvent(error.message));
      } else {
        document.body.dispatchEvent(new UncaughtErrorEvent(error.status + " " + error.statusText + " on " + error.url));
      }
    }
  }

}
