import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import ShortUserBookDTO from 'src/app/classes/dto/books/short_user';
import { ApiService } from 'src/app/services/api/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-organisation-details-page',
  templateUrl: './organisation-details-page.component.html',
  styleUrls: ['./organisation-details-page.component.css']
})
export class OrganisationDetailsPageComponent implements OnInit, OnDestroy {

  public org_id!: string;

  public name: string;
  public description: string | null;
  public owner : { id: string, username: string } | null;
  public books: ShortUserBookDTO[];

  public joined: boolean;
  public is_admin: boolean;
  public logged_in: boolean;

  private paramsSubscription!: Subscription;
  private userSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private userService: UserService) {
    this.name = '';
    this.description = null;
    this.owner = null;
    this.books = [];
    this.joined = false;
    this.is_admin = false;
    this.logged_in = false
  }

  public ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      const uuid = params.get('uuid');
      if(uuid == null) {
        this.router.navigate(['/organisations']);
        return;
      }
      this.org_id = uuid;
      if(this.userSubscription !== undefined && !this.userSubscription.closed) {
        this.userSubscription.unsubscribe();
      }
      this.userSubscription = this.userService.whenInitialised(() => {
        this.logged_in = this.userService.isConnected();
        if(this.logged_in) {
          this.joined = this.userService.inOrganisation(this.org_id);
          this.is_admin = this.userService.isAdmin();
        }
      });
      this.refreshFromApi();
    });
  }

  private refreshFromApi() {
    this.api.organisations.getOrganisation(this.org_id, org => {
      if(org === null) {
        this.router.navigate(['/organisations']);
        return;
      }
      this.name = org.name;
      this.description = org.desc;
      if(this.description !== null && this.description === '') {
        this.description = null;
      }
      this.owner = org.owner;
      this.books = org.books.sort((b1, b2) => b1.name.localeCompare(b2.name))
    });
  }


  public join() {
    this.api.organisations.joinOrganisation(this.org_id, this.userService.getUuid(), _ => {
      this.joined = true;
      this.userService.refreshLogin();
    });
  }


  public ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    if(this.userSubscription !== undefined && !this.userSubscription.closed) {
      this.userSubscription.unsubscribe();
    }
  }

}
