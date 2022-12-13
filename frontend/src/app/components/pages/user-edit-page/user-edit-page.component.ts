import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import FullUserBookDTO from 'src/app/classes/dto/books/full_user';
import { Visibility } from 'src/app/classes/dto/enums';
import ShortUserOrganisationDTO from 'src/app/classes/dto/organisations/short_user';
import { ApiService } from 'src/app/services/api/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit-page',
  templateUrl: './user-edit-page.component.html',
  styleUrls: ['./user-edit-page.component.css']
})
export class UserEditPageComponent implements OnInit, OnDestroy {

  public user_id!: string;

  public username: string;
  public visibility: Visibility;
  public admin: boolean;
  public organisations: ShortUserOrganisationDTO[];
  public books: FullUserBookDTO[];

  public can_leave: boolean;

  private userSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private userService: UserService) {
    this.username = '';
    this.visibility = 'PUBLIC';
    this.admin = false;
    this.organisations = [];
    this.books = [];
    this.can_leave = false;
  }

  public ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');

    this.userSubscription = this.userService.whenInitialised(() => {
      if(!this.userService.isConnected()) {
        this.router.navigate(['/user/' + uuid]);
        return;
      }
      if(this.userService.getUuid() != uuid) {
        this.router.navigate(['/user/' + this.userService.getUuid()]);
        return;
      }
      this.user_id = uuid;
      this.updateFromApi();
    })
  }

  public updateFromApi() {
    this.api.users.getDetailedUser(this.user_id, user => {
      this.username = user.username;
      this.visibility = user.visibility;
      this.admin = user.role === 'ADMIN';
      this.organisations = user.organisations.sort((o1, o2) => o1.name.localeCompare(o2.name));
      this.books = user.books.sort((b1, b2) => b1.name.localeCompare(b2.name));
      this.can_leave = this.organisations.every(o => !o.owned); // TODO or active loans
    });
  }
  

  public onSignout(): void {

  }

  public onVisibilityChanged(event: Event & { checked: boolean }): void {
    const visibility: Visibility = event.checked ? 'PUBLIC' : 'RESTRICTED';
    this.api.users.setUserVisibility(this.user_id, visibility, () => {});
  }


  public ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

}
