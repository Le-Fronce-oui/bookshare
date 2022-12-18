import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import ShortOrganisationDTO from 'src/app/classes/dto/organisations/short';
import { ApiService } from 'src/app/services/api/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-organisation-search-page',
  templateUrl: './organisation-search-page.component.html',
  styleUrls: ['./organisation-search-page.component.css']
})
export class OrganisationSearchPageComponent implements OnInit, OnDestroy {

  public logged_in: boolean;

  public filter: string;

  public organisations: ShortOrganisationDTO[];

  private userSubscription!: Subscription;

  constructor(public api: ApiService, public userService: UserService) {
    this.filter = '';
    this.organisations = [];
    this.logged_in = false;
  }

  public ngOnInit(): void {
    this.userSubscription = this.userService.observeConnected(connected => {
      this.logged_in = connected;
    })
    this.api.organisations.getOrganisations(organisations => {
      this.organisations = organisations.sort((o1, o2) => o1.name.localeCompare(o2.name));
    });
  }

  public ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

}
