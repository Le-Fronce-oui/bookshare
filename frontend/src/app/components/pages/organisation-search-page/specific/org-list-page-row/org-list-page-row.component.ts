import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import ShortOrganisationDTO from 'src/app/classes/dto/organisations/short';
import { ApiService } from 'src/app/services/api/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'tr[org-list-page-row]',
  templateUrl: './org-list-page-row.component.html',
  styleUrls: ['./org-list-page-row.component.css']
})
export class OrgListPageRowComponent implements OnInit, OnDestroy {

  @Input() public organisation!: ShortOrganisationDTO;
  @Input() public join_button: boolean;

  public name: string;
  public org_link: string;
  public user_count: number;
  public joined: boolean;

  public join_clicked: boolean;

  private userSubscription?: Subscription;

  constructor(private api: ApiService, private userService: UserService) {
    this.join_button = false;
    this.name = '';
    this.org_link = '/organisations';
    this.user_count = 1;
    this.joined = true;
    this.join_clicked = false;
  }

  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges) {
    const organisation: ShortOrganisationDTO = changes.organisation.currentValue;
    this.name = organisation.name;
    this.org_link = "/organisation/" + organisation.id;
    this.user_count = organisation.user_count;
    if(this.userSubscription !== undefined) {
      this.userSubscription.unsubscribe();
    }
    this.userSubscription = this.userService.whenInitialised(() => {
      this.joined = this.userService.inOrganisation(organisation.id)
    });
  }

  public join(): void {
    this.join_clicked = true;
    this.api.organisations.joinOrganisation(this.organisation.id, this.userService.getUuid(), ok => {
      this.joined = true;
      if(ok) {
        this.user_count += 1;
      }
      this.userService.refreshLogin();
    });
  }

  public ngOnDestroy(): void {
    if(this.userSubscription !== undefined) {
      this.userSubscription.unsubscribe();
    }
  }

}
