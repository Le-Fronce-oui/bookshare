import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import OrgRole from 'src/app/classes/enums/org_role';
import { ApiService } from 'src/app/services/api/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Member } from '../member';

@Component({
  selector: 'tr[org-members-page-row]',
  templateUrl: './org-members-page-row.component.html',
  styleUrls: ['./org-members-page-row.component.css']
})
export class OrgMembersPageRowComponent implements OnInit {

  @Input() public member!: Member;
  @Input('admin') public as_admin: boolean;
  @Input('owner') public as_owner: boolean;

  public org_role: OrgRole

  public admin: boolean;
  public access: boolean;
  
  constructor(private api: ApiService, private notif: NotificationService) {
    this.admin = false;
    this.access = true;
    this.org_role = 'USER';
    this.as_admin = false;
    this.as_owner = false;
  }

  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    const user: Member = changes.member.currentValue;
    this.admin = user.org_role === 'ADMIN';
    this.access = !user.banned;
    this.org_role = user.is_owner ? 'OWNER' : user.org_role;
  }

  public onAdmin(event: Event & { checked: boolean }): void {
    if(event.checked) {
      // this.api.users.grantUserSiteAdmin(this.user.id, () => {
      //   this.notif.success("User " + this.username + " promoted to admin");
      // })
    }
  }

  public onAccess(event: Event & { checked: boolean }): void {
    const ban: boolean = !event.checked;
    // this.api.users.setUserSiteBan(this.user.id, ban, () => {
    //   this.notif.success("User " + this.username + (ban ? " banned" : " unbanned"));
    // })
  }

}
