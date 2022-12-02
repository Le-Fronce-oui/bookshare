import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { validateEmail } from 'src/app/globals';
import { ApiService } from 'src/app/services/api/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})
export class SigninPageComponent implements OnInit, OnDestroy {

  public nextPath: string | null;

  public username: string;
  public email:    string;
  public password: string;
  public confirm:  string;

  // Used to check if the fields are valid
  private username_ok: boolean;
  private email_ok:    boolean;
  private password_ok: boolean;
  private confirm_ok:  boolean;
  public  ok:          boolean;

  // Used for displaying the errors in the fields
  public username_dirty: boolean;
  public email_dirty:    boolean;
  public password_dirty: boolean;
  public confirm_dirty:  boolean;

  private connectionSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private userService: UserService, private notificationService: NotificationService) {
    this.nextPath = null;
    this.username = '';
    this.email    = '';
    this.password = '';
    this.confirm  = '';
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

  public ngOnInit(): void { // TODO this could go in the template
    this.connectionSubscription = this.userService.observeConnected(connected => {
      if(connected) {
        if(this.nextPath === null) {
          this.nextPath = "/user/" + this.userService.getUuid();
        }
        this.notificationService.success("Logged in as " + this.userService.getUsername());
        this.router.navigate([this.nextPath], {replaceUrl: true});
      }
    });
    this.route.queryParams.subscribe(p => {
      if('next' in p) {
        this.nextPath = p.next;
      }
    });
  }

  public checkUsername(): void {
    this.username = this.username.trim();
    this.username_ok = (this.username.length > 0);
    this.username_dirty = !this.username_ok;
    this.updateValidity();
  }

  public checkEmail(): void {
    this.email = this.email.trim();
    this.email_ok = validateEmail(this.email);
    this.email_dirty = !this.email_ok;
    this.updateValidity();
  }

  public checkPassword(): void {
    this.password_ok = (this.password.length >= 8);
    this.password_dirty = !this.password_ok;
    if(this.password_dirty) {
      this.notificationService.warning('Password must be at least 8 characters long');
    }
    this.updateValidity();
  }

  public clearConfirm(): void {
    console.log("Clear confirm");
    this.confirm = '';
    this.checkConfirm();
    console.log(this.confirm);
  }

  public peekConfirm(): void {
    this.confirm_ok = (this.password == this.confirm);
    if(this.confirm_ok) {
      this.confirm_dirty = false;
    }
    this.updateValidity();
  }

  public checkConfirm(): void {
    this.peekConfirm();
    this.confirm_dirty = !this.confirm_ok;
  }

  private updateValidity(): void {
    this.ok = this.email_ok && this.username_ok && this.password_ok && this.confirm_ok;
  }

  public onSigninButton(): void {
    this.api.auth.signin(this.username, this.email, this.password, 
      res => {
        if(this.nextPath === null) {
          this.nextPath = "/user/" + res.user_id;
        }
        this.userService.refreshLogin();
      },
      err => {
        if(!err.name) {
          this.notificationService.error("Username or email already taken");
        }
        if(!err.password) {
          this.password_dirty = true;
          this.password_ok = false;
          this.confirm_dirty = true;
          this.confirm_ok = false;
          this.notificationService.error("Bad password");
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this.connectionSubscription.unsubscribe();
  }

}
