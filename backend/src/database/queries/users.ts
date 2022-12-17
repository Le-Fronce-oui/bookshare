import { pool } from "../connect";
import { Callable, Consumer, ErrorHandler } from '../../types/functions';
import DatabaseUser from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { manageError } from "../errors";
import { Role } from "@prisma/client";
import Visibility from "../models/visibility";
import { BookUpdateCountDTO } from "../../dto/books/updates";

let no_Users: boolean = false;

getUserCount(c => no_Users = (c == 0));


export function getUserCount(consumer: Consumer<number>): void {
    pool.query('SELECT COUNT(*) FROM "Users";').then(qres => {
        consumer(qres.rows[0]['count']);
    });
}

export function getAllUsers(consumer: Consumer<DatabaseUser[]>, onError: ErrorHandler): void {
    pool.query('SELECT * FROM "Users";').then(qres => {
        consumer(qres.rows);
    }, err => onError(err));
}

export function getUserById(user_id: string, consumer: Consumer<DatabaseUser | null>, onError?: ErrorHandler): void {
    pool.query('SELECT * FROM "Users" WHERE id = $1;', [user_id]).then(qres => {
        consumer(qres.rowCount == 1 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}

export function getUserByEmail(email: string, consumer: Consumer<DatabaseUser | null>, onError: ErrorHandler): void {
    pool.query('SELECT * FROM "Users" WHERE email = $1;', [email]).then(qres => {
        consumer(qres.rowCount == 1 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}


export function checkUserUniqueness(email: string, username: string, consumer: Consumer<boolean>, onError: ErrorHandler): void {
    pool.query('SELECT COUNT(*) FROM "Users" WHERE email = $1 OR username = $2;', [email, username]).then(qres => {
        consumer(qres.rows[0]['count'] == 0);
    }).catch(e => manageError(e, onError));
}

export function createUser(email: string, username: string, hash: string, salt: string, consumer: Consumer<string>, onError: ErrorHandler): void {
    const uuid = uuidv4();
    const role: Role = no_Users ? 'ADMIN' : 'USER';
    pool.query(
        'INSERT INTO "Users" VALUES($1, $2, $3, $4, $5, \'PRIVATE\', $6, false)',
        [uuid, email, username, hash, salt, role]
    ).then(_ => {
        no_Users = false;
        consumer(uuid);
    }).catch(e => manageError(e, onError));
}

// It's almost christmas, so here is a christmas tree
// FYI, Postgresq does *not* allow several prepared statements at once
export function deleteUser(user_id: string, callback: Callable, onError: ErrorHandler): void {
    pool.query('UPDATE "Loans" SET "declinedAt" = CURRENT_TIMESTAMP WHERE "ownerId" = $1 AND ("declinedAt" = NULL OR "acceptedAt" = NULL);', [user_id]).then(_ => {
        pool.query(`
            DELETE FROM "Loans" WHERE 
                ("ownerId" = $1 AND "borrowerId" = NULL) 
                OR ("ownerId" = NULL AND "borrowerId" = $1)
                OR ("borrowerId" = $1 AND ("declinedAt" = NULL OR "acceptedAt" = NULL));
        `, [user_id]).then(_ => {
            pool.query('UPDATE "Loans" SET "ownerId" = NULL WHERE "ownerId" = $1;', [user_id]).then(_ => {
                pool.query('UPDATE "Loans" SET "borrowerId" = NULL WHERE "borrowerId" = $1;', [user_id]).then(_ => {
                    pool.query('DELETE FROM "Members" WHERE "userId" = $1;', [user_id]).then(_ => {
                        pool.query('DELETE FROM "Collections" WHERE "userId" = $1;', [user_id]).then(_ => {
                            pool.query('DELETE FROM "Users" WHERE id = $1;', [user_id]).then(_ => {
                                callback();
                            }).catch(e => manageError(e, onError));
                        }).catch(e => manageError(e, onError));
                    }).catch(e => manageError(e, onError));
                }).catch(e => manageError(e, onError));
            }).catch(e => manageError(e, onError));
        }).catch(e => manageError(e, onError));
    }).catch(e => manageError(e, onError));
}


export function updateUserPassword(user_id: string, hash: string, salt: string, callback: Callable, onError: ErrorHandler): void {
    pool.query(
        'UPDATE "Users" SET password = $1, salt = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $3;',
        [hash, salt, user_id]
    ).then(_ => {
        callback();
    }).catch(e => manageError(e, onError));
}

export function setUserVisibility(user_id: string, visibility: Visibility, callback: Callable, onError: ErrorHandler): void {
    pool.query(
        'UPDATE "Users" SET visibility = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2;',
        [visibility, user_id]
    ).then(_ => {
        callback();
    }).catch(e => manageError(e, onError));
}

export function setUserSiteRole(user_id: string, role: Role, callback: Consumer<boolean>, onError: ErrorHandler): void {
    pool.query(
        'UPDATE "Users" SET "role" = CAST($1 AS "Role"), "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 AND (NOT "banned" OR $1 <> \'ADMIN\');',
        [role, user_id]
    ).then(res => {
        callback(res.rowCount > 0);
    }).catch(e => manageError(e, onError));
}

export function setUserSiteBan(user_id: string, banned: boolean, callback: Consumer<boolean>, onError: ErrorHandler): void {
    pool.query(
        'UPDATE "Users" SET banned = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 AND (NOT $1 OR "role" <> \'ADMIN\');',
        [banned, user_id]
    ).then(res => {
        console.log(res);
        callback(res.rowCount > 0);
    }).catch(e => manageError(e, onError));
}


export function addBookToCollection(user_id: string, book_id: string, owned: number, shown: number, 
            callback: Callable, onError: ErrorHandler): void {
    pool.query('INSERT INTO "Collections" VALUES($1, $2, $3, 0, $4);', [user_id, book_id, owned, shown])
        .then(callback)
        .catch(e => manageError(e, onError));
}

export function removeBooksFromCollection(user_id: string, books: string[], callback: Consumer<boolean>, onError: ErrorHandler): void {
    if(books.length === 0) {
        callback(true);
        return;
    }
    pool.query('DELETE FROM "Collections" WHERE "userId" = $1 AND "bookId" = ANY($2::text[]);', [user_id, books])
        .then(qres => {
            callback(books.length === qres.rowCount);
        }).catch(e => manageError(e, onError));
}

/*
Alternative using JSON string input:

WITH a AS (
    SELECT (tmp->>'id')::text AS id, (tmp->>'count')::int AS count, (tmp->>'shown')::int AS shown FROM (
        SELECT json_array_elements($2::json)
        AS tmp
    ) AS a
)
UPDATE "Collections"
SET num_owned = a.count, num_shown = a.shown
FROM a
WHERE "Collections"."userId" = $1 AND "Collections"."bookId" = a.id;
*/
export function updateBooksInCollection(user_id: string, books: BookUpdateCountDTO[], callback: Consumer<boolean>, onError: ErrorHandler): void {
    if(books.length === 0) {
        callback(true);
        return;
    }
    const book_ids = books.map(b => b.book_id);
    const book_counts = books.map(b => b.count);
    const book_showns = books.map(b => b.shown);
    pool.query(`
        UPDATE "Collections"
        SET num_owned = a.count, num_shown = a.shown
        FROM UNNEST(
            $2::text[],
            $3::int[],
            $4::int[]
        ) AS a(id, count, shown)
        WHERE "Collections"."userId" = $1 AND "Collections"."bookId" = a.id;
    `, [user_id, book_ids, book_counts, book_showns]).then(qres => {
            callback(books.length === qres.rowCount);
        }).catch(e => manageError(e, onError));
}
