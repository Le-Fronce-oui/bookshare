import { Component, OnInit } from '@angular/core';
import { EMAIL_REGEX } from 'src/app/globals';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})
export class SigninPageComponent implements OnInit {

  public username: string;
  public email: string;
  public password: string;
  public confirm_password: string;

  // Used to check if the fields are valid
  private username_ok: boolean;
  private email_ok:    boolean;
  private password_ok: boolean;
  private confirm_ok:  boolean;
  public  ok:          boolean;

  // Used for displaying the errors in the fields
  public username_dirty: boolean;
  public email_dirty: boolean;
  public password_dirty: boolean;
  public confirm_dirty: boolean;

  constructor() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirm_password = '';
    this.username_ok = false;
    this.email_ok    = false;
    this.password_ok = false;
    this.confirm_ok  = false;
    this.ok          = false;
    this.username_dirty = false;
    this.email_dirty    = false;
    this.password_dirty = false;
    this.confirm_dirty  = false;
  }

  ngOnInit(): void {
  }

  public checkUsername() {
    this.username = this.username.trim();
    this.username_ok = (this.username.length > 0);
    this.username_dirty = !this.username_ok;
    this.updateValidity();
  }

  public checkEmail() {
    this.email = this.email.trim();
    this.email_ok = EMAIL_REGEX.test(this.email + " ");
    this.email_dirty = !this.email_ok;
    this.updateValidity();
  }

  public checkPassword() {
    this.password_ok = (this.password.length >= 6);
    this.password_dirty = !this.password_ok;
    this.updateValidity();
  }

  public peekConfirm() {
    this.confirm_ok = (this.password == this.confirm_password);
    if(this.confirm_ok) {
      this.confirm_dirty = false;
    }
    this.updateValidity();
  }

  public checkConfirm() {
    this.peekConfirm();
    this.confirm_dirty = !this.confirm_ok;
  }

  private updateValidity() {
    this.ok = this.email_ok && this.username_ok && this.password_ok && this.confirm_ok;
  }

  public onSigninButton(): void {
    alert("signin");
  }

}
