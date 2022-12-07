import { pool } from "../connect";
import { Callable, Consumer, ErrorHandler } from 'src/types/functions';
import DatabaseUser from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { manageError } from "../errors";
import { Role } from "@prisma/client";
import Visibility from "../models/visibility";

let no_Users: boolean = false;

getUserCount(c => no_Users = (c == 0));


export function getUserCount(consumer: Consumer<number>) {
    pool.query('SELECT COUNT(*) FROM "Users";').then(qres => {
        consumer(qres.rows[0]['count']);
    });
}

export function getUserById(user_id: string, consumer: Consumer<DatabaseUser | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Users" WHERE id = $1;', [user_id]).then(qres => {
        consumer(qres.rowCount == 1 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}

export function getUserByEmail(email: string, consumer: Consumer<DatabaseUser | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Users" WHERE email = $1;', [email]).then(qres => {
        consumer(qres.rowCount == 1 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}

export function checkUserUniqueness(email: string, username: string, consumer: Consumer<boolean>, onError?: ErrorHandler) {
    pool.query('SELECT COUNT(*) FROM "Users" WHERE email = $1 OR username = $2;', [email, username]).then(qres => {
        consumer(qres.rows[0]['count'] == 0);
    }).catch(e => manageError(e, onError));
}

export function createUser(email: string, username: string, hash: string, salt: string, consumer: Consumer<string>, onError?: ErrorHandler) {
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

export function updateUserPassword(user_id: string, hash: string, salt: string, callback: Callable, onError?: ErrorHandler) {
    pool.query(
        'UPDATE "Users" SET password = $1, salt = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $3;',
        [hash, salt, user_id]
    ).then(_ => {
        callback();
    }).catch(e => manageError(e, onError));
}

export function updateUserVisibility(user_id: string, visibility: Visibility, callback: Callable, onError?: ErrorHandler) {
    pool.query(
        'UPDATE "Users" SET visibility = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2;',
        [visibility, user_id]
    ).then(_ => {
        callback();
    }).catch(e => manageError(e, onError));
}

export function deleteUser(user_id: string, callback: Callable, onError?: ErrorHandler) {
    pool.query('DELETE FROM "Users" WHERE id = $1;', [user_id]).then(_ => {
        callback();
    }).catch(e => manageError(e, onError));
}
