import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import ShortUserOrganisationDTO from 'src/app/classes/dto/organisations/short_user';
import { UserService } from 'src/app/services/user.service';
import { LoanDialogComponent } from './loan-dialog/loan-dialog.component';

@Component({
  selector: 'app-header-footer-template',
  templateUrl: './header-footer-template.component.html',
  styleUrls: ['./header-footer-template.component.css'],
  providers: [ DialogService ]
})
export class HeaderFooterTemplateComponent implements OnInit, OnDestroy {

  static readonly REPO_URL = 'https://github.com/Le-Fronce-oui/bookshare';

  public readonly url = HeaderFooterTemplateComponent.REPO_URL;

  public connected: boolean;
  public admin: boolean;
  public organisations: ShortUserOrganisationDTO[];
  public uuid: string;
  public username: string;
  public has_loans: boolean;

  private userSubscription!: Subscription;
  private dialogSubscription!: Subscription;

  constructor(private dialogService: DialogService, private readonly userService: UserService) {
    this.uuid = '';
    this.username = '';
    this.connected = false;
    this.admin = false;
    this.organisations = [];
    this.has_loans = false;
  }

  public logout(): void {
    this.userService.logout();
  }

  public ngOnInit(): void {
    this.userSubscription = this.userService.observeConnected(connected => {
      this.connected = connected;
      this.admin = this.connected && this.userService.isAdmin();
      this.organisations = this.connected ? this.userService.getOrganisations() : [];
      this.uuid = this.userService.getUuid();
      this.username = this.userService.getUsername();
      this.has_loans = this.userService.hasLoans();
    });
  }


  public openLoans(): void {
    const ref = this.dialogService.open(LoanDialogComponent, {
      header: 'Loans',
      position: 'top',
      dismissableMask: true,
      draggable: false
    });
    if(this.dialogSubscription !== undefined) {
      this.dialogSubscription.unsubscribe();
    }
    this.dialogSubscription = ref.onClose.subscribe(() => {
      this.userService.refreshLogin();
    });
  }


  public ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    if(this.dialogSubscription && !this.dialogSubscription.closed) {
      this.dialogSubscription.unsubscribe();
    }
  }

}
