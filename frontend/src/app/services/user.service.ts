import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private admin: boolean;

  constructor() {
    this.admin = false;
  }

  public isConnected(): boolean {
    return false;
  }

  public isAdmin(): boolean {
    return this.isConnected() && this.admin;
  }

  public getUuid(): string {
    return "";
  }

  public getUsername(): string {
    return "";
  }
  
}
