import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import BookDTO from 'src/app/classes/dto/books/full';
import ShortBookDTO from 'src/app/classes/dto/books/short';
import { NotificationService } from '../../notification.service';

@Injectable({
  providedIn: 'root'
})
export class BooksApiService {

  constructor(private http: HttpClient) { }

  public getBooks(callback: (response: ShortBookDTO[]) => void): void {
    this.http.get<ShortBookDTO[]>('/api/books/short').subscribe(callback);
  }

  public getBook(book_id: string, callback: (response: BookDTO) => void, onError: () => void): void {
    this.http.get<BookDTO>('/api/book/' + book_id).subscribe(callback, (error) => {
        if(error.status === 404) {
          onError();
        } else { throw error; }
      }
    );
  }

}
