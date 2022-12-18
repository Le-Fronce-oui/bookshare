import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import ShortUserBookDTO from 'src/app/classes/dto/books/short_user';
import OrgRole from 'src/app/classes/enums/org_role';
import { ApiService } from 'src/app/services/api/api.service';
import { UserService } from 'src/app/services/user.service';

interface Org {
  id: string,
  name: string,
  role: OrgRole
}

@Component({
  selector: 'app-user-details-page',
  templateUrl: './user-details-page.component.html',
  styleUrls: ['./user-details-page.component.css']
})
export class UserDetailsPageComponent implements OnInit, OnDestroy {

  public user_id!: string;

  public username: string;
  public admin: boolean;
  public books: ShortUserBookDTO[];
  public organisations: Org[];
  public logged_in: boolean;

  private userSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, private api: ApiService) {
    this.username = '';
    this.admin = false;
    this.books = [];
    this.organisations = [];
    this.logged_in = false;
  }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if(uuid == null) {
      this.router.navigate(['/index']);
      return;
    }
    this.user_id = uuid;
    this.api.users.getUser(this.user_id, user => {
      if(user === null) {
        this.router.navigate(['/index']);
        return;
      }
      this.username = user.username;
      this.admin = user.role === 'ADMIN';
      this.books = user.books.sort((b1, b2) => b1.name.localeCompare(b2.name));
      this.organisations = user.organisations.map(org => ({
        id: org.id,
        name: org.name,
        role: org.owned ? 'OWNER' : org.role
      }));
      this.userSubscription = this.userService.whenInitialised(() => {
        if(this.userService.isConnected()) {
          this.logged_in = this.userService.getUuid() === this.user_id;
        }
      })
    })
  }

  public ngOnDestroy(): void {
      if(this.userSubscription !== undefined) {
        this.userSubscription.unsubscribe();
      }
  }

}
