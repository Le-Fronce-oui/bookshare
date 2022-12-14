import { Consumer, ErrorHandler } from "src/types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";
import DatabaseLoan from "../models/loan";

export function getLoans(consumer: Consumer<DatabaseLoan[]>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Loans";').then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function getLoanById(loan_id: string, consumer: Consumer<DatabaseLoan | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Loans" WHERE id = $1;', [loan_id]).then(qres => {
        consumer(qres.rows.length > 0 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}

export function getLoansForUser(user_id: string, consumer: Consumer<DatabaseLoan[]>, onError?: ErrorHandler) {
    pool.query('SELECT "id" FROM "Loans" WHERE "Loans"."borrower_id" = $1 OR "Loans"."owner_id" = $1;', [user_id]).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function setLoanToReturned(loan_id: string, now: Date, consumer: Consumer<boolean>, onError?: ErrorHandler) {
    pool.query('UPDATE "Loans" SET "returnedAt" = $2 WHERE id = $1;', [loan_id, now]).then(qres => {
        consumer(qres.rows.length > 0);
    }).catch(e => manageError(e, onError));
}
export function setLoanToDeclined(loan_id: string, now: Date, consumer: Consumer<boolean>, onError?: ErrorHandler) {
    pool.query('UPDATE "Loans" SET "declinedAt" = $2 WHERE id = $1;', [loan_id, now]).then(qres => {
        consumer(qres.rows.length > 0);
    }).catch(e => manageError(e, onError));
}
export function setLoanToAccepted(loan_id: string, now: Date, consumer: Consumer<boolean>, onError?: ErrorHandler) {
    pool.query('UPDATE "Loans" SET "acceptedAt" = $2 WHERE id = $1;', [loan_id, now]).then(qres => {
        consumer(qres.rows.length > 0);
    }).catch(e => manageError(e, onError));
}

export function setLoanToBorrowed(loan_id: string, now: Date, consumer: Consumer<boolean>, onError?: ErrorHandler) {
    pool.query('UPDATE "Loans" SET "borrowedAt" = $2 WHERE id = $1;', [loan_id, now]).then(qres => {
        consumer(qres.rows.length > 0);
    }).catch(e => manageError(e, onError));
}

