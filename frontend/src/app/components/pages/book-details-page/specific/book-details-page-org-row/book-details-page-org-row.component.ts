import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import BookInOrgDTO from 'src/app/classes/dto/books/in_org';
import { ApiService } from 'src/app/services/api/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'tr[book-details-page-org-row]',
  templateUrl: './book-details-page-org-row.component.html',
  styleUrls: ['./book-details-page-org-row.component.css']
})
export class BookDetailsPageOrgRowComponent implements OnInit {

  @Input() user!: BookInOrgDTO;
  @Input() book_id!: string;
  @Input() org_id!: string;
  @Input() with_borrows: boolean;

  public can_borrow: boolean;

  constructor(private api: ApiService, private notif: NotificationService, private userService: UserService) {
    this.with_borrows = false;
    this.can_borrow = false;
  }

  public ngOnInit(): void { }

  public ngOnChanges(_: SimpleChanges) {
    if(this.with_borrows && this.userService.isConnected()) {
      this.can_borrow = this.user.available > 0 && this.userService.getUuid() !== this.user.user_id;
    } else {
      this.can_borrow = false;
    }
  }

  public borrow(): void {
    this.api.loans.createLoan(this.org_id, this.book_id, this.user.user_id, () => {
      this.notif.success("Borrow request sent");
      this.can_borrow = false;
    });
  }

}
