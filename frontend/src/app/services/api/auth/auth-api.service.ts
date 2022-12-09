import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import UserCreationErrorDTO from 'src/app/classes/dto/user_creation_error';
import UserCreationDTO from 'src/app/classes/dto/user_creation_request';
import UserIdResponseDTO from 'src/app/classes/dto/user_id_response';
import UserLoginDTO from 'src/app/classes/dto/user_login';
import { NotificationService } from '../../notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient, private notificationService: NotificationService) { }


  public signin(username: string, email: string, password: string, 
      callback: (response: UserIdResponseDTO)    => void,
      onError:  (response: UserCreationErrorDTO) => void): void {
    const body: UserCreationDTO = { username: username, email: email, password: password };
    this.http.post<UserIdResponseDTO>('/api/signin', body, {observe: 'body'})
      .subscribe(callback, (error: HttpErrorResponse) => {
        if(error.status === 400) {
          onError(error.error);
        } else { throw error; }
      }
    );
  }


  public login(email: string, password: string, callback: (response: UserIdResponseDTO) => void): void {
    const body: UserLoginDTO = { email: email, password: password };
    this.http.post<UserIdResponseDTO>('/api/login', body, {observe: 'body'})
      .subscribe(callback, (error: HttpErrorResponse) => {
        if(error.status === 400) {
          this.notificationService.error('Wrong username or password');
        } else if(error.status === 403) {
          this.notificationService.error('You have been banned form this site');
        } else { throw error; }
      }
    );
  }


  public logout(callback: () => void): void {
    this.http.post<UserIdResponseDTO>('/api/logout', {observe: 'body'})
      .subscribe(_ => callback());
  }
  
}
