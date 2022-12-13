import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import UserConnectedDTO from '../../../classes/dto/user_connected';
import DetailedUserDTO from '../../../classes/dto/users/detailed';
import { Visibility } from '../../../classes/dto/enums';
import ShortUserDTO from 'src/app/classes/dto/users/short';
import UserDTO from 'src/app/classes/dto/users/full';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(private http: HttpClient) { }


  public getAllUsers(callback: (response: ShortUserDTO[]) => void): void {
    this.http.get<ShortUserDTO[]>('/api/users/short', {observe: 'body'})
      .subscribe(callback);
  }

  public getUser(user_id: string, callback: (response: UserDTO | null) => void): void {
    this.http.get<UserConnectedDTO>("/api/user/" + user_id, {observe: 'body'})
      .subscribe(callback, (error: HttpErrorResponse) => {
        if(error.status === 404) {
          callback(null);
        } else { throw error; }
      });
  }


  public getConnectedUser(callback: (response: UserConnectedDTO | null) => void): void {
    this.http.get<UserConnectedDTO>('/api/user/connected', { observe: 'body' })
      .subscribe(callback, (error: HttpErrorResponse) => {
        if(error.status === 401) {
          callback(null);
        } else { throw error; }
      });
  }

  public getDetailedUser(user_id: string, callback: (response: DetailedUserDTO) => void): void {
    this.http.get<DetailedUserDTO>("/api/user/" + user_id + "/detailed", { observe: 'body' })
      .subscribe(callback);
  }


  public setUserVisibility(user_id: string, visibility: Visibility, callback: () => void): void {
    this.http.post("/api/user/" + user_id + "/visibility?visibility=" + visibility, null, { responseType: 'text' })
      .subscribe(_ => callback());
  }


  public setUserSiteBan(user_id: string, banned: boolean, callback: () => void): void {
    this.http.post("/api/user/" + user_id + "/access?ban=" + banned, null, { responseType: 'text' })
      .subscribe(_ => callback());
  }

  public grantUserSiteAdmin(user_id: string, callback: () => void): void {
    this.http.post("/api/user/" + user_id + "/admin", null, { responseType: 'text' })
      .subscribe(_ => callback());
  }

  
  public addBookToCollection(user_id: string, book_id: string, callback: () => void): void {
    this.http.put("/api/user/" + user_id + "/book/" + book_id, null, { responseType: 'text' })
      .subscribe(_ => callback());
  }

}
