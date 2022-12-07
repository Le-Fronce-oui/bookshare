import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import UserConnectedDTO from '../../../classes/dto/user_connected';
import UserVisibilityDTO from '../../../classes/dto/users/visibility';
import { NotificationService } from '../../notification.service';
import { Visibility } from '../../../classes/dto/enums';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(private http: HttpClient, private notificationService: NotificationService) { }


  public getConnectedUser(callback: (response: UserConnectedDTO | null) => void): void {
    this.http.get<UserConnectedDTO>('/api/user/connected', {observe: 'body'})
      .subscribe(callback, (error: HttpErrorResponse) => {
        if(error.status === 401) {
          callback(null);
        } else { throw error; }
      }
    );
  }

  public getUserVisibility(user_id: string, callback: (response: UserVisibilityDTO) => void): void {
    this.http.get<UserVisibilityDTO>("/api/user/" + user_id + "/visibility" , {observe: 'body'})
      .subscribe(callback);
  }

  public setUserVisibility(user_id: string, visibility: Visibility, callback: () => void): void {
    this.http.post("/api/user/" + user_id + "/visibility?visibility=" + visibility, null, { responseType: 'text' })
      .subscribe(_ => callback());
  }

}
