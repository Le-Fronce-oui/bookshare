import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import ShortBookDTO from '../classes/dto/books/short';
import ShortUserOrganisationDTO from '../classes/dto/organisations/short_user';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static readonly PREVIOUS_LOGIN_PROP = '__bs_logged_in';

  private connected: BehaviorSubject<boolean>;
  private initialised: BehaviorSubject<boolean>;

  private admin: boolean;
  private username: string;
  private uuid: string;
  private organisations: Map<String,ShortUserOrganisationDTO>;
  private books: Map<String,ShortBookDTO>;

  constructor(private api: ApiService) {
    this.connected = new BehaviorSubject<boolean>(false);
    this.initialised = new BehaviorSubject<boolean>(false);
    this.admin = false;
    this.username = '';
    this.uuid = '';
    this.organisations = new Map();
    this.books = new Map();
    let previous_login = window.localStorage.getItem(UserService.PREVIOUS_LOGIN_PROP);
    if(previous_login === 'false') {
      this.initialised.next(true);
    } else {
      this.refreshLogin();
    }
  }

  public refreshLogin() {
    this.api.users.getConnectedUser(res => {
      if(res !== null) {
        this.uuid = res.id;
        this.admin = (res.role === 'ADMIN');
        this.username = res.username;
        this.organisations = new Map(res.organisations.map(o => [o.id, o]));
        this.books = new Map(res.books.map(b => [b.id, b]));
        window.localStorage.setItem(UserService.PREVIOUS_LOGIN_PROP, 'true');
        this.connected.next(true);
        if(!this.initialised.value) {
          this.initialised.next(true);
        }
      } else {
        this.clearData();
        if(!this.initialised.value) {
          this.initialised.next(true);
        }
      }
    })
  }

  public isConnected(): boolean {
    return this.connected.getValue();
  }

  public observeConnected(callback: (connected: boolean) => void): Subscription {
    return this.connected.subscribe(callback);
  }

  public whenInitialised(callback: () => void): Subscription {
    return this.initialised.subscribe(init => {
      if(init) {
        callback();
      }
    });
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

  // Organisations

  public hasOrganisations(): boolean {
    return this.organisations.size > 0;
  }

  public getOrganisations(): ShortUserOrganisationDTO[] {
    return Array.from(this.organisations.values());
  }

  public inOrganisation(org_id: string): boolean {
    return this.organisations.has(org_id);
  }

  public isOrgAdmin(org_id: string): boolean {
    let org = this.organisations.get(org_id);
    return org !== undefined && org.role === 'ADMIN';
  }

  public isOrgOwner(org_id: string): boolean {
    let org = this.organisations.get(org_id);
    return org !== undefined && org.owned;
  }

  // Books

  public getBooks(): ShortBookDTO[] {
    return Array.from(this.books.values());
  }

  public hasBook(book_id: string): boolean {
    return this.books.has(book_id);
  }

  // Log out

  public logout(): void {
    this.api.auth.logout(() => {
      this.clearData();
      window.location.reload();
    });
  }

  private clearData(): void {
    window.localStorage.setItem(UserService.PREVIOUS_LOGIN_PROP, 'false');
    this.connected.next(false);
    this.admin = false;
    this.username = '';
    this.uuid = '';
    this.organisations.clear();
    this.books.clear();
  }
  
}
