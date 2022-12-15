import { Injectable } from '@angular/core';
import { AuthApiService } from './auth/auth-api.service';
import { BooksApiService } from './books/books-api.service';
import { LoansApiService } from './loans/loans-api.service';
import { OrganisationsApiService } from './organisations/organisations-api.service';
import { UsersApiService } from './users/users-api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public readonly auth: AuthApiService,
    public readonly users: UsersApiService,
    public readonly books: BooksApiService,
    public readonly organisations: OrganisationsApiService,
    public readonly loans: LoansApiService
  ) { }

}
