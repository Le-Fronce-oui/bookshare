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
