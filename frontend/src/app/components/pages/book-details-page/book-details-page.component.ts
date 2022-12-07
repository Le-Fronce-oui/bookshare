import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import BookDTO from 'src/app/classes/dto/books/full';
import { ApiService } from 'src/app/services/api/api.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-book-details-page',
  templateUrl: './book-details-page.component.html',
  styleUrls: ['./book-details-page.component.css']
})
export class BookDetailsPageComponent implements OnInit {

  public book_id!: string;
  public book!: BookDTO;
  public org_id: string | null;

  public cover_path: string;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiService, private notificationService: NotificationService) {
    this.cover_path = AppComponent.DEFAULT_COVER_GRADIENT;
    this.org_id = null;
  }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if(uuid == null) {
      this.router.navigate(['/books']);
      return;
    }
    this.book_id = uuid;
    this.api.books.getBook(uuid, book => {
      this.book = book;
      if(this.book.cover !== null) {
        this.cover_path = "url(\"/assets/covers/" + this.book.cover + "\")";
      }
    }, () => {
      this.notificationService.error('Book not found', this.book_id);
      this.router.navigate(['/books']);
    });
    this.route.queryParams.subscribe(params => {
      this.org_id = ('from_org' in params) ? params.from_org : null
      // TODO some API call ...
    });
  }

}
