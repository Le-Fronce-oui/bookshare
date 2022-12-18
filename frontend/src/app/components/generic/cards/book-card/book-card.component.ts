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
  @Input() public count:    number;
  @Input() public org_id:   string | null;

  public cover_path: string;
  public params: {[param: string]: string};

  constructor() {
    this.cover = null;
    this.cover_path = AppComponent.DEFAULT_COVER_GRADIENT;
    this.count = 0;
    this.org_id = null;
    this.params = {};
  }

  public ngOnInit(): void { }

  public ngOnChanges(changes: SimpleChanges): void {
    if(this.org_id === null) {
      this.params = {}
    } else {
      this.params = { 'from_org': this.org_id };
    }
    const cover = changes.cover.currentValue;
    if(cover === null) {
      this.cover_path = AppComponent.DEFAULT_COVER_GRADIENT;
    } else {
      this.cover_path = "url(\"/assets/covers/" + cover + "\")";
    }
  }

}
