import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { UserService } from 'src/app/services/user.service';
import { Member } from './specific/member';

@Component({
  selector: 'app-organisation-members-page',
  templateUrl: './organisation-members-page.component.html',
  styleUrls: ['./organisation-members-page.component.css']
})
export class OrganisationMembersPageComponent implements OnInit, OnDestroy {

  public org_id!: string;

  private org_owner: string;
  public members: Member[];

  public admin: boolean;
  public owner: boolean;

  private userSubscription!: Subscription;
  private routeSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private userService: UserService) {
    this.admin = false;
    this.owner = false;
    this.org_owner = '';
    this.members = [];
  }

  public ngOnInit(): void {
    this.userSubscription = this.userService.whenInitialised(() => {
      this.routeSubscription = this.route.paramMap.subscribe(params => {
        const uuid = params.get('uuid');
        if(uuid == null) {
          this.router.navigate(['/organisations']);
          return;
        }
        this.org_id = uuid;
        if(!this.userService.isConnected()) {
          this.router.navigate(['/organisation/', this.org_id]);
        }
        this.admin = (this.userService.isAdmin() || this.userService.isOrgAdmin(this.org_id));
        if(!this.admin && !this.userService.inOrganisation(this.org_id)) {
          this.router.navigate(['/organisation/', this.org_id]);
        }
        this.owner = this.userService.isOrgOwner(this.org_id);
        this.updateFromApi();
      });
    });
  }


  private updateFromApi(): void {
    this.api.organisations.getOrganisationMembers(this.org_id, members => {
      this.org_owner = members.owner;
      this.members = members.members.map(u => ({
        id: u.id,
        username: u.username,
        admin: u.admin,
        banned: u.banned,
        org_role: u.org_role,
        is_owner: (u.id === this.org_owner)
      }));
    });
  }


  public ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
      this.routeSubscription.unsubscribe();
  }

}
