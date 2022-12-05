import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import UserConnectedDTO from 'src/app/classes/dto/user_connected';
import { NotificationService } from '../../notification.service';

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
}
