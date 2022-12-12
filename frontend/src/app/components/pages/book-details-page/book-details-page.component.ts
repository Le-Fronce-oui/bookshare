import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import BookDTO from 'src/app/classes/dto/books/full';
import BookInOrgDTO from 'src/app/classes/dto/books/in_org';
import { ApiService } from 'src/app/services/api/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.component.html',
  styleUrls: ['./book-details-page.component.css']
})
export class BookDetailsPageComponent implements OnInit, OnDestroy {

  public book_id!: string;
  public book!: BookDTO;
  public org_id: string | null;
  public org_users: BookInOrgDTO[];

  public logged_in: boolean;
  public saved: boolean;

  public cover_path: string;

  private userSubscription!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, 
        private notificationService: NotificationService, private userService: UserService) {
    this.cover_path = AppComponent.DEFAULT_COVER_GRADIENT;
    this.org_id = null;
    this.org_users = [];
    this.logged_in = false;
    this.saved = false;
  }

  public ngOnInit(): void {
    // Check UUID in route
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if(uuid == null) {
      this.router.navigate(['/books']);
      return;
    }
    this.book_id = uuid;

    // Get user status
    this.userSubscription = this.userService.observeConnected(connected => {
      this.logged_in = connected;
      if(connected) {
        this.saved = this.userService.hasBook(this.book_id);
      }
    });

    // Get book from API
    this.api.books.getBook(uuid, book => {
      this.book = book;
      if(this.book.cover !== null) {
        this.cover_path = "url(\"/assets/covers/" + this.book.cover + "\")";
      }
    }, () => {
      this.notificationService.error('Book not found', this.book_id);
      this.router.navigate(['/books']);
    });

    // Potentially get organisation from URL parameters
    this.route.queryParams.subscribe(params => {
      this.org_id = ('from_org' in params) ? params.from_org : null
      if(this.org_id !== null) {
        this.api.organisations.getBookInOrg(this.book_id, this.org_id, 
          records => { this.org_users = records }, 
          () => {
            this.router.navigate([], {
              queryParams: { from_org: null },
              queryParamsHandling: 'merge',
              replaceUrl: true
            })
          }
        );
      }
    });
  }


  public saveToCollection() {
    this.saved = true;
    this.api.users.addBookToCollection(this.userService.getUuid(), this.book_id, () => {
      this.notificationService.success('Book saved to personal collection');
      this.userService.refreshLogin();
    })
  }


  public ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
  }

}
