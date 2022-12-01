import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private admin: boolean;
  private connected: boolean;
  private username: string;
  private uuid: string;

  constructor() {
    this.connected = false;
    this.admin = true;
    this.username = 'Username';
    this.uuid = 'lol'
  }

  public isConnected(): boolean {
    return this.connected;
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
    this.connected = false;
    this.admin = false;
    this.username = '';
    this.uuid = '';
    window.location.reload();
  }
  
}
