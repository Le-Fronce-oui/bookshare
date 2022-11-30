import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { validateEmail } from 'src/app/globals';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
    this.nextPath = null;
    this.email    = '';
    this.password = '';
    this.email_ok    = false;
    this.password_ok = false;
    this.ok          = false;
    this.email_dirty    = false;
    this.password_dirty = false;
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      if('next' in p) {
        this.nextPath = p.next;
      } else if(this.userService.isConnected()) {
        this.nextPath = "/user/" + this.userService.getUuid();
      }
      if(this.userService.isConnected()) {
        this.router.navigate([this.nextPath], {replaceUrl: true});
      }
    });
  }

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
    alert("login");
    // TODO api call + alert if problems
    if(this.nextPath === null) {
      this.nextPath = "/user/" + "TODO";
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {next: this.nextPath}, 
      queryParamsHandling: 'merge'
    });
    window.location.reload();
  }
  

}
