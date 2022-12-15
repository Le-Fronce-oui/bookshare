import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoansApiService {

  constructor(private http: HttpClient) { }

  public createLoan(org_id: string, book_id: string, user_id: string, callback: () => void) {
    this.http.put("/api/organisation/" + org_id + "/request/" + book_id + "/from/" + user_id, null, { responseType: 'text' })
      .subscribe(callback);
  }

}
