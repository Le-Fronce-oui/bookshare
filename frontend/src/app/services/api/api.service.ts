import { Injectable } from '@angular/core';
import { AuthApiService } from './auth/auth-api.service';
import { UsersApiService } from './users/users-api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public readonly auth: AuthApiService,
    public readonly users: UsersApiService
  ) { }

}
