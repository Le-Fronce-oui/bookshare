import { Consumer, ErrorHandler } from "../../types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";
import { DatabaseBook, UserDatabaseBook, DatabaseUserBooksInOrg } from "../models/book";


export function getBooks(consumer: Consumer<DatabaseBook[]>, onError: ErrorHandler): void {
    pool.query('SELECT * FROM "Books";').then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function getBookById(book_id: string, consumer: Consumer<DatabaseBook | null>, onError: ErrorHandler): void {
    pool.query('SELECT * FROM "Books" WHERE id = $1;', [book_id]).then(qres => {
        consumer(qres.rows.length > 0 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}


export function getBooksForUser(user_id: string, consumer: Consumer<UserDatabaseBook[]>, onError: ErrorHandler): void {
    pool.query(`
        SELECT "Books".*, num_owned, num_lent, num_shown 
        FROM "Books", "Collections" 
        WHERE "Collections"."userId" = $1 AND "Collections"."bookId" = "Books".id;
    `, [user_id]).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}


export function getBookInOrganisation(org_id: string, book_id: string, req_user_id: string | null, 
            consumer: Consumer<DatabaseUserBooksInOrg[]>, onError: ErrorHandler): void {
    let query: string;
    let params = [org_id, book_id];
    if(req_user_id === null) {
        query = `
            SELECT "Users".id AS user_id, "Users".username AS username, "Collections".num_shown AS owned, "Collections".num_lent AS lent
            FROM "Users", "Members", "Collections"
            WHERE "Members"."userId" = "Users".id
                AND "Collections"."userId" = "Users".id 
                AND "Users".visibility = 'PUBLIC'
                AND "Members"."orgaId" = $1
                AND "Collections"."bookId" = $2
                AND "Collections".num_shown > 0
                AND NOT "Members".banned;
        `;
    } else {
        query = `
            SELECT "Users".id AS user_id, "Users".username AS username, "Collections".num_shown AS owned, "Collections".num_lent AS lent
            FROM "Users", "Members", "Collections"
            WHERE "Members"."userId" = "Users".id
                AND "Collections"."userId" = "Users".id
                AND "Members"."orgaId" = $1
                AND "Collections"."bookId" = $2
                AND "Collections".num_shown > 0
                AND NOT "Members".banned
                AND "Members"."orgaId" NOT IN (
                    SELECT "orgaId" AS id FROM "Members"
                    WHERE "Members"."userId" = $3 AND "Members".banned
                )
        `;
        params.push(req_user_id);
    }
    pool.query(query, params).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}


export function getBookCover(name: string, consumer: Consumer<Buffer | null>, onError: ErrorHandler): void {
    pool.query('SELECT image FROM "Covers" where id = $1;', [name]).then(qres => {
        consumer(qres.rows.length > 0 ? qres.rows[0].image : null);
    }).catch(e => manageError(e, onError));
}
