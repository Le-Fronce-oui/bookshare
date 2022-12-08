import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import ShortBookDTO from '../classes/dto/books/short';
import ShortOrganisationDTO from '../classes/dto/organisations/short';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private connected: BehaviorSubject<boolean>;

  private admin: boolean;
  private username: string;
  private uuid: string;
  private organisations: Map<String,ShortOrganisationDTO>;
  private books: Map<String,ShortBookDTO>;

  constructor(private api: ApiService) {
    this.connected = new BehaviorSubject<boolean>(false);
    this.admin = false;
    this.username = '';
    this.uuid = '';
    this.organisations = new Map();
    this.books = new Map();
    this.refreshLogin();
  }

  public refreshLogin() {
    this.api.users.getConnectedUser(res => {
      if(res !== null) {
        this.uuid = res.id;
        this.admin = (res.role === 'ADMIN');
        this.username = res.username;
        this.organisations = new Map(res.organisations.map(o => [o.id, o]));
        this.books = new Map(res.books.map(b => [b.id, b]));
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

  // Organisations

  public hasOrganisations(): boolean {
    return this.organisations.size > 0;
  }

  public getOrganisations(): ShortOrganisationDTO[] {
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
    this.connected.next(false);
    this.admin = false;
    this.username = '';
    this.uuid = '';
    this.organisations.clear();
    this.books.clear();
  }
  
}
