import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import ShortUserDTO from 'src/app/classes/dto/users/short';
import { ApiService } from 'src/app/services/api/api.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'tr[user-list-page-row]',
  templateUrl: './user-list-page-row.component.html',
  styleUrls: ['./user-list-page-row.component.css']
})
export class UserListPageRowComponent implements OnInit, OnChanges {

  @Input() public user!: ShortUserDTO;

  public username: string;
  public user_link: string;
  public admin: boolean;
  public access: boolean;

  constructor(private api: ApiService, private notif: NotificationService) {
    this.username = '';
    this.user_link = '';
    this.admin = false;
    this.access = true;
  }

  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges) {
    const user: ShortUserDTO = changes.user.currentValue;
    this.username = user.username;
    this.user_link = "/user/" + user.id;
    this.admin = user.admin;
    this.access = !user.banned;
  }

  public onAdmin(event: any): void {
    if(event.checked) {
      this.api.users.grantUserSiteAdmin(this.user.id, () => {
        this.notif.success("User " + this.username + " promoted to admin");
      })
    }
  }

  public onAccess(event: any): void {
    const ban: boolean = !event.checked;
    this.api.users.setUserSiteBan(this.user.id, ban, () => {
      this.notif.success("User " + this.username + (ban ? " banned" : " unbanned"));
    })
  }

}
