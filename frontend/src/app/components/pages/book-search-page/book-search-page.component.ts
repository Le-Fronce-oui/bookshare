import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ShortBookDTO from 'src/app/classes/dto/books/short';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-book-search-page',
  templateUrl: './book-search-page.component.html',
  styleUrls: ['./book-search-page.component.css']
})
export class BookSearchPageComponent implements OnInit {

  public books: ShortBookDTO[];

  public filter: string;

  constructor(private api: ApiService) {
    this.books = [];
    this.filter = '';
  }

  public ngOnInit(): void {
    this.api.books.getBooks(books => {
      this.books = books.sort((b1, b2) => b1.name.localeCompare(b2.name));
      console.log(this.books);
    })
  }

}
