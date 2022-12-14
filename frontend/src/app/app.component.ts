import { Component } from '@angular/core';
import { UncaughtErrorEvent } from './classes/events/uncaught-error-event';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  public static readonly DEFAULT_COVER_GRADIENT = "linear-gradient(to bottom right, var(--col-primary-light), var(--col-tertiary-light))";

  constructor(private notificationService: NotificationService) {
    document.body.addEventListener(UncaughtErrorEvent.EVENT_NAME, e => this.errorHandler(e as UncaughtErrorEvent));
  }

  private errorHandler(event: UncaughtErrorEvent): void {
    this.notificationService.error('Unexpected error occured', event.detail);
  }
  
}
