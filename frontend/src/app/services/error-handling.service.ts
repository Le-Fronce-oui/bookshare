import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { UncaughtErrorEvent } from '../classes/events/uncaught-error-event';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService implements ErrorHandler {

  constructor() { }

  private notify(message: string) {
    document.body.dispatchEvent(new UncaughtErrorEvent(message));
  }

  public handleError(error: any): void {
    if(error instanceof HttpErrorResponse) {
      if(error.status === 0) {
        this.notify(error.message);
      } else {
        let message = error.status + " " + error.statusText;
        let location = error.url;
        if(location !== null) {
          if(location.startsWith(window.location.origin)) {
            location = location.substring(window.location.origin.length);
          }
          message += " on " + location;
        }
        this.notify(message);
      }
    }
  }

}
