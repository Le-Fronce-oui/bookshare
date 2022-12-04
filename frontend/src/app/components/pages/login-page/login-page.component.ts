import { Component, OnInit } from '@angular/core';
import { validateEmail } from 'src/app/globals';
import { UserService } from 'src/app/services/user.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ValidatedField } from 'src/app/classes/validated/validated-field';
import { CorrectedValidatedField } from 'src/app/classes/validated/corrected/corrected-validated-field';
import { ValidationGroup } from 'src/app/classes/validated/validation-group';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public nextPath: string | null;

  public checkGroup: ValidationGroup<string>;

  public email:    ValidatedField<string>;
  public password: ValidatedField<string>;

  constructor(private api: ApiService, private userService: UserService) {
    this.nextPath = null;
    this.checkGroup = new ValidationGroup();
    this.email    = new CorrectedValidatedField<string>('', validateEmail, v => v.trim());
    this.password = new ValidatedField<string>('', v => v.length > 0);
    this.checkGroup.addField(this.email);
    this.checkGroup.addField(this.password);
  }

  public ngOnInit(): void { }

  public onLoginButton(): void {
    this.checkGroup.ok = false;
    this.api.auth.login(this.email.value, this.password.value, res => {
      if(this.nextPath === null) {
        this.nextPath = "/user/" + res.user_id;
      }
      this.userService.refreshLogin();
    });
  }

}
