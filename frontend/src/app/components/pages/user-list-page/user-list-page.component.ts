import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import ShortUserDTO from 'src/app/classes/dto/users/short';
import { ApiService } from 'src/app/services/api/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list-page',
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.css']
})
export class UserListPageComponent implements OnInit, OnDestroy {

  public users: ShortUserDTO[];

  private userSubscription!: Subscription;

  constructor(private router: Router, private api: ApiService, private user: UserService) {
    this.users = [];
  }

  public ngOnInit(): void {
    this.userSubscription = this.user.whenInitialised(() => {
      if(!this.user.isConnected()) {
        this.router.navigate(['/login'], { queryParams: { next: this.router.url } });
        return;
      }
      if(!this.user.isAdmin()) {
        this.router.navigate(['/index']);
        return;
      }
      this.api.users.getAllUsers(users => {
        this.users = users.sort((u1, u2) => u1.username.localeCompare(u2.username))
      });
    });
  }

  public ngOnDestroy(): void {
      if(!this.userSubscription.closed) {
        this.userSubscription.unsubscribe();
      }
  }

}
