import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FullLoanDTO } from 'src/app/classes/dto/loans/fullLoanDTO';

@Injectable({
  providedIn: 'root'
})
export class LoansApiService {

  constructor(private http: HttpClient) { }

  public createLoan(org_id: string, book_id: string, user_id: string, callback: () => void): void {
    this.http.put("/api/organisation/" + org_id + "/request/" + book_id + "/from/" + user_id, null, { responseType: 'text' })
      .subscribe(callback);
  }

  public getLoan(loan_id: string, callback: (loan: FullLoanDTO) => void): void {
    this.http.get<FullLoanDTO>("/api/loan/" + loan_id, { observe: 'body' })
      .subscribe(callback);
  }


  public acceptLoan(loan_id: string, callback: () => void): void {
    this.http.post("/api/loan/" + loan_id + "/accept", null, { responseType: 'text' })
      .subscribe(callback);
  }

  public declineLoan(loan_id: string, callback: () => void): void {
    this.http.post("/api/loan/" + loan_id + "/decline", null, { responseType: 'text' })
      .subscribe(callback);
  }

  public loanBorrowed(loan_id: string, callback: () => void): void {
    this.http.post("/api/loan/" + loan_id + "/borrowed", null, { responseType: 'text' })
      .subscribe(callback);
  }

  public loanReturned(loan_id: string, callback: () => void): void {
    this.http.post("/api/loan/" + loan_id + "/returned", null, { responseType: 'text' })
      .subscribe(callback);
  }

}
