import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }

  private message(severity: 'info' | 'success' | 'warn' | 'error', title: string, detail: string | undefined = undefined): void {
    this.messageService.add({severity: severity, summary: title, detail: detail, key: 'notifications'});
    console.log("[notif:" + severity.toUpperCase() + "]", title);
  }

  public info(title: string, detail: string | undefined = undefined) {
    this.message('info', title, detail);
  }

  public success(title: string, detail: string | undefined = undefined) {
    this.message('success', title, detail);
  }

  public warning(title: string, detail: string | undefined = undefined) {
    this.message('warn', title, detail);
  }

  public error(title: string, detail: string | undefined = undefined) {
    this.message('error', title, detail);
  }

}
