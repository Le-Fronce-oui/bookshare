import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit, OnChanges {

  @Input() public title!:   string;
  @Input() public book_id!: string;
  @Input() public cover:    string | null;

  public book_link:  string;
  public cover_path: string;

  constructor() {
    this.cover = null;
    this.book_link = '/books';
    this.cover_path = AppComponent.DEFAULT_COVER_GRADIENT;
  }

  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges): void {
    const book_id = changes.book_id.currentValue;
    this.book_link = "/book/" + book_id;
    const cover = changes.cover.currentValue;
    if(cover === null) {
      this.cover_path = AppComponent.DEFAULT_COVER_GRADIENT;
    } else {
      this.cover_path = "url(\"/assets/covers/" + cover + "\")";
    }
  }

}
