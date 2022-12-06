import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit, OnChanges {

  private static readonly DEFAULT_COVER_URL = '/assets/covers/default.jpg';
  private static readonly DEFAULT_COVER = "url(\"" + BookCardComponent.DEFAULT_COVER_URL + "\")";


  @Input() public title!:   string;
  @Input() public book_id!: string;
  @Input() public cover?:   string;

  public book_link:  string;
  public cover_path: string;

  constructor() {
    this.book_link = '/books';
    this.cover_path = BookCardComponent.DEFAULT_COVER;
  }

  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges): void {
    const book_id = changes.book_id.currentValue;
    this.book_link = "/book/" + book_id;
    const cover = changes.cover.currentValue;
    if(cover === undefined) {
      this.cover_path = BookCardComponent.DEFAULT_COVER;
    } else {
      this.cover_path = "url(\"/assets/covers/" + cover + "\")";
    }
  }

}
