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

  constructor(private api: ApiService) {
    this.books = [];
  }

  ngOnInit(): void {
    this.api.books.getBooks(books => {
      this.books = books;
      console.log(this.books);
    })
  }

}
