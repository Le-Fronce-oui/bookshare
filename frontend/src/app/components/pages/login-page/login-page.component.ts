import { Component, OnInit } from '@angular/core';
import { validateEmail } from 'src/app/globals';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public nextPath: string | null;

  public email:    string;
  public password: string;

  private email_ok:    boolean = false;
  private password_ok: boolean = false;
  public  ok:          boolean = false;

  public email_dirty:    boolean = false;
  public password_dirty: boolean = false;

  constructor(private api: ApiService, private userService: UserService) {
    this.nextPath = null;
    this.email    = '';
    this.password = '';
    this.email_ok    = false;
    this.password_ok = false;
    this.ok          = false;
    this.email_dirty    = false;
    this.password_dirty = false;
  }

  public ngOnInit(): void { }

  public checkEmail(): void {
    this.email = this.email.trim();
    this.email_ok = validateEmail(this.email);
    this.email_dirty = !this.email_ok;
    this.updateValidity();
  }

  public peekPassword(): void {
    this.password_ok = (this.password.length > 0);
    if(this.password_ok) {
      this.password_dirty = false;
      this.updateValidity();
    }
  }

  public checkPassword(): void {
    this.peekPassword();
    this.password_dirty = !this.password_ok;
    this.updateValidity();
  }

  private updateValidity(): void {
    this.ok = this.email_ok && this.password_ok;
  }

  public onLoginButton(): void {
    this.ok = false;
    this.api.auth.login(this.email, this.password, res => {
      if(this.nextPath === null) {
        this.nextPath = "/user/" + res.user_id;
      }
      this.userService.refreshLogin();
    });
  }

}
