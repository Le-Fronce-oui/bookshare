import { Consumer, ErrorHandler } from "../../types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";
import { DatabaseBook, UserDatabaseBook, DatabaseUserBooksInOrg } from "../models/book";


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


export function getBookInOrganisation(org_id: string, book_id: string, loggedIn: boolean, 
            consumer: Consumer<DatabaseUserBooksInOrg[]>, onError?: ErrorHandler) {
    let query: string;
    if(loggedIn) {
        query = `
            SELECT "Users".id as user_id, "Users".name as username, "Collections".shown as owned, "Collections".lent
            FROM "Users", "Members", "Collections"
            WHERE "Members"."userId" = "Users".id
                AND "Collections"."userId" = "Users".id 
                AND "Users".visibility = 'PUBLIC'
                AND "Members"."orgaId" = $1
                AND "Collections"."bookId" = $2
                AND "Collections".shown > 0
        `;
    } else {
        query = `
            SELECT "Users".id as user_id, "Users".name as username, "Collections".shown as owned, "Collections".lent
            FROM "Users", "Members", "Collections"
            WHERE "Members"."userId" = "Users".id
                AND "Collections"."userId" = "Users".id
                AND "Members"."orgaId" = $1
                AND "Collections"."bookId" = $2
                AND "Collections".shown > 0
        `;
    }
    pool.query(query, [org_id, book_id]).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}
