import { pool } from "../connect";
import { Callable, Consumer, ErrorHandler } from 'src/types/functions';
import DatabaseUser from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { manageError } from "../errors";


export function getUserById(user_id: string, consumer: Consumer<DatabaseUser | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM users WHERE id = $1;', [user_id]).then(qres => {
        consumer(qres.rowCount == 1 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}

export function getUserByEmail(email: string, consumer: Consumer<DatabaseUser | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM users WHERE email = $1;', [email]).then(qres => {
        consumer(qres.rowCount == 1 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}

export function checkUserUniqueness(email: string, username: string, consumer: Consumer<boolean>, onError?: ErrorHandler) {
    pool.query('SELECT COUNT(*) FROM users WHERE email = $1 OR username = $2;', [email, username]).then(qres => {
        consumer(qres.rows[0]['count'] == 0);
    }).catch(e => manageError(e, onError));
}

export function createUser(email: string, username: string, hash: string, salt: string, consumer: Consumer<string>, onError?: ErrorHandler) {
    const uuid = uuidv4();
    pool.query(
        'INSERT INTO users VALUES($1, $2, $3, $4, $5, \'PRIVATE\', \'USER\', false)', 
        [uuid, email, username, hash, salt]
    ).then(_ => {
        consumer(uuid);
    }).catch(e => manageError(e, onError));
}

export function updateUserPassword(user_id: string, hash: string, salt: string, callback: Callable, onError?: ErrorHandler) {
    pool.query(
        'UPDATE users SET password = $1, salt = $2 WHERE id = $3;', 
        [hash, salt, user_id]
    ).then(qres => {
        console.log(qres);
        callback();
    }).catch(e => manageError(e, onError));
}

export function deleteUser(user_id: string, callback: Callable, onError?: ErrorHandler) {
    pool.query('DELETE FROM users WHERE id = $1;', [user_id]).then(_ => {
        callback();
    }).catch(e => manageError(e, onError));
}
