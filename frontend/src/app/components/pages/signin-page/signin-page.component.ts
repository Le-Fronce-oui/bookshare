import { Component, OnInit } from '@angular/core';
import { CorrectedValidatedField } from 'src/app/classes/validated/corrected/corrected-validated-field';
import { ValidatedField } from 'src/app/classes/validated/validated-field';
import { ValidationGroup } from 'src/app/classes/validated/validation-group';
import { validateEmail } from 'src/app/globals';
import { ApiService } from 'src/app/services/api/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})
export class SigninPageComponent implements OnInit {

  public nextPath: string | null;

  public checkGroup: ValidationGroup<string>;

  public username: ValidatedField<string>;
  public email:    ValidatedField<string>;
  public password: ValidatedField<string>;
  public confirm:  ValidatedField<string>;

  constructor(private api: ApiService, private userService: UserService, private notificationService: NotificationService) {
    this.nextPath = null;
    this.checkGroup = new ValidationGroup();
    this.username = new CorrectedValidatedField<string>('', v => v.length > 0, v => v.trim());
    this.email    = new CorrectedValidatedField<string>('', validateEmail, v => v.trim());
    this.password = new ValidatedField<string>('', v => v.length >= 8);
    this.password.setOnDirtyChanged(dirty => {
      if(dirty) {
        this.notificationService.warning('Password must be at least 8 characters long');
      }
    });
    this.confirm  = new ValidatedField<string>('', v => v.length > 0 && v === this.password.value);
    this.checkGroup.addField(this.username);
    this.checkGroup.addField(this.email);
    this.checkGroup.addField(this.password);
    this.checkGroup.addField(this.confirm);
  }

  public ngOnInit(): void { }

  public clearConfirm(): void {
    this.confirm.value = '';
    this.confirm.check();
  }

  public onSigninButton(): void {
    this.checkGroup.ok = false;
    this.api.auth.signin(this.username.value, this.email.value, this.password.value, 
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
          this.password.makeDirty();
          this.confirm.makeDirty();
          this.notificationService.error("Bad password");
        }
      }
    );
  }

}
