import { Consumer, ErrorHandler } from "src/types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";
import { DatabaseBook, UserDatabaseBook } from "../models/book";


export function getBooks(consumer: Consumer<DatabaseBook[]>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Books";').then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function getBookById(book_id: string, consumer: Consumer<DatabaseBook | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Books" WHERE id = $1;', [book_id]).then(qres => {
        consumer(qres.rows.length > 0 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}


export function getBooksForUser(user_id: string, consumer: Consumer<UserDatabaseBook[]>, onError?: ErrorHandler) {
    pool.query(`
        SELECT "Books".*, num_owned, num_lent, num_shown 
        FROM "Books", "Collections" 
        WHERE "Collections"."userId" = $1 AND "Collections"."bookId" = "Books".id;
    `, [user_id]).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}
