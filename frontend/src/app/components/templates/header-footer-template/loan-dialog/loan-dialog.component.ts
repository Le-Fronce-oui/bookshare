import { Component, HostListener, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import ShortBookDTO from 'src/app/classes/dto/books/short';
import { FullLoanDTO } from 'src/app/classes/dto/loans/fullLoanDTO';
import { ApiService } from 'src/app/services/api/api.service';
import { UserService } from 'src/app/services/user.service';

type LoanStatus = 'created' | 'declined' | 'accepted' | 'borrowed' | 'returned';

function timestampToString(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

@Component({
  selector: 'app-loan-dialog',
  templateUrl: './loan-dialog.component.html',
  styleUrls: ['./loan-dialog.component.css']
})
export class LoanDialogComponent implements OnInit {

  private i: number;
  private loans: string[];

  public current_loan: string;
  public book!: ShortBookDTO;
  public is_owner: boolean;
  public other_user: string;
  public other_user_id: string | null;
  public events: { date: string, status: LoanStatus }[];
  public status: LoanStatus;

  public left: boolean;
  public right: boolean;

  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig, private userService: UserService, private api: ApiService) {
    this.i = 0;
    this.current_loan = '';
    this.is_owner = false;
    this.other_user = '';
    this.other_user_id = null;
    this.events = [];
    this.status = 'returned';
    this.left = false;
    this.right = false;
    this.loans = [];
  }

  public ngOnInit(): void {
    this.loans = this.userService.getLoans();
    this.selectLoan(this.i);
  }

  public selectLoan(i: number): void {
    this.current_loan = this.loans[i];
    this.api.loans.getLoan(this.current_loan, loan => {
      this.is_owner = (this.userService.getUuid() === loan.owner?.id);
      let other_user = this.is_owner ? loan.borrower : loan.owner;
      if(other_user === null) {
        this.other_user = '[deleted]';
        this.other_user_id = null;
      } else {
        this.other_user = other_user.username;
        this.other_user_id = other_user.id;
      }
      this.book = loan.book;
      this.config.header = this.book.name;
      this.status = this.eventsFromLoan(loan);
      this.i = i;
      this.left = i > 0;
      this.right = i < this.loans.length - 1;
    });
  }

  private eventsFromLoan(loan: FullLoanDTO): LoanStatus {
    this.events = [];
    this.events.push({ date: timestampToString(loan.createdAt), status: 'created'});
    if(loan.declinedAt !== null) {
      this.events.push({ date: timestampToString(loan.declinedAt), status: 'declined'});
      return 'declined';
    }
    if(loan.acceptedAt !== null) {
      this.addEvent('accepted', loan.acceptedAt);
      if(loan.borrowedAt !== null) {
        this.addEvent('borrowed', loan.borrowedAt);
        if(loan.returnedAt !== null) {
          this.addEvent('returned', loan.returnedAt);
          return 'returned';
        }
        return 'borrowed';
      }
      return 'accepted';
    }
    return 'created';
  }

  private addEvent(status: LoanStatus, timestamp: number): void {
    this.events.push({ date: timestampToString(timestamp), status: status});
  }


  public onLeft(): void {
    if(this.left) {
      this.selectLoan(this.i - 1);
    }
  }

  public onRight(): void {
    if(this.right) {
      this.selectLoan(this.i + 1);
    }
  }

  @HostListener('window:keydown', ['$event'])
  public onKeyDown(event: { key: string, ctrlKey: boolean, shiftKey: boolean }): void {
    if(event.key === 'ArrowRight') {
      if(this.right && (event.ctrlKey || event.shiftKey)) {
        this.selectLoan(this.loans.length - 1);
      } else {
        this.onRight();
      }
    } else if(event.key === 'ArrowLeft') {
      if(this.left && (event.ctrlKey || event.shiftKey)) {
        this.selectLoan(0);
      } else {
        this.onLeft();
      }
    }
  }


  public onAccept(): void {
    this.api.loans.acceptLoan(this.current_loan, () => {
      this.selectLoan(this.i);
    });
  }

  public onDecline(): void {
    this.api.loans.declineLoan(this.current_loan, () => {
      this.selectLoan(this.i);
    });
  }

  public onBorrowed(): void {
    this.api.loans.loanBorrowed(this.current_loan, () => {
      this.selectLoan(this.i);
    });
  }

  public onReturned(): void {
    this.api.loans.loanReturned(this.current_loan, () => {
      this.selectLoan(this.i);
    });
  }

}
