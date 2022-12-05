import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private connected: BehaviorSubject<boolean>;

  private admin: boolean;
  private username: string;
  private uuid: string;

  constructor(private api: ApiService) { // TODO organisations
    this.connected = new BehaviorSubject<boolean>(false);
    this.admin = false;
    this.username = '';
    this.uuid = ''
    this.refreshLogin();
  }

  public refreshLogin() {
    this.api.users.getConnectedUser(res => {
      if(res !== null) {
        this.uuid = res.id;
        this.admin = (res.role === 'ADMIN');
        this.username = res.username;
        this.connected.next(true);
      } else {
        this.clearData();
      }
    })
  }

  public isConnected(): boolean {
    return this.connected.getValue();
  }

  public observeConnected(callback: (connected: boolean) => void): Subscription {
    return this.connected.subscribe(callback);
  }

  public isAdmin(): boolean {
    return this.isConnected() && this.admin;
  }

  public getUuid(): string {
    return this.uuid;
  }

  public getUsername(): string {
    return this.username;
  }

  public logout(): void {
    this.api.auth.logout(() => {
      this.clearData();
      window.location.reload();
    });
  }

  private clearData(): void {
    this.connected.next(false);
    this.admin = false;
    this.username = '';
    this.uuid = '';
  }
  
}
