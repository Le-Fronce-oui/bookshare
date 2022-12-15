import { Consumer, ErrorHandler } from "src/types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";
import DatabaseLoan from "../models/loan";
import { v4 as uuidv4 } from 'uuid';

/*
INSERT INTO "Loans"
SELECT 'temp', '4bdbc898-4625-4621-a5e8-7fd1fed9f72e', '74528d9a-6732-43d0-82a2-2fe0e008b4da', 'cece3da2-c440-43a2-a443-2a87aec8b737', '754e8e61-3d58-429a-8471-39303e9203fe'
WHERE EXISTS (
    SELECT 1 FROM "Books" WHERE id = '74528d9a-6732-43d0-82a2-2fe0e008b4da'
) AND 2 = (
    SELECT COUNT(*)
    FROM "Members"
    WHERE "orgaId" = '4bdbc898-4625-4621-a5e8-7fd1fed9f72e'
        AND ("userId" = '754e8e61-3d58-429a-8471-39303e9203fe' OR "userId" = 'cece3da2-c440-43a2-a443-2a87aec8b737')
        AND NOT banned
);
*/

export function createLoan(book_id: string, org_id: string, owner_id: string, borrower_id: string,
            consumer: Consumer<boolean>, onError?: ErrorHandler): void {
    const uuid = uuidv4();
    pool.query(`
        INSERT INTO "Loans"
        SELECT $1, $2, $3, $4, $5
        WHERE EXISTS (
            SELECT 1 FROM "Books" WHERE id = $3
        ) AND 2 = (
            SELECT COUNT(*)
            FROM "Members"
            WHERE "orgaId" = $2
                AND ("userId" = $4 OR "userId" = $5)
                AND NOT banned
        );
    `, [uuid, org_id, book_id, owner_id, borrower_id]).then(qres => {
        consumer(qres.rowCount === 1);
    }).catch(e => manageError(e, onError));
}

export function getLoans(consumer: Consumer<DatabaseLoan[]>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Loans";').then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function getLoanById(loan_id: string, user_req_id: string, consumer: Consumer<DatabaseLoan | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Loans" WHERE id = $1 AND ("Loans"."borrower_id" = $2 OR "Loans"."owner_id" = $2);', [loan_id, user_req_id]).then(qres => {
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

