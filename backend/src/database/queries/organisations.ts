import { Consumer, ErrorHandler } from "src/types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";
import { DatabaseBookInOrg } from "../models/book";
import { DatabaseOrganisation, DatabaseOrganisationWithCount, UserDatabaseOrganisation } from "../models/organisations";
import Role from "../models/role";
import { OrganisationUser } from "../models/user";


export function getAllOrganisations(user_id: string | null, consumer: Consumer<DatabaseOrganisationWithCount[]>, onError: ErrorHandler): void {
    let params = [];
    let query: string;
    if(user_id == null) {
        query = `
            SELECT "Organisations".*, COUNT("Members"."userId") as user_count
            FROM "Organisations", "Members", "Users"
            WHERE "Organisations".id = "Members"."orgaId"
                AND "Users".id = "Members"."userId"
                AND "Organisations".visibility = 'PUBLIC'
                AND "Users".visibility = 'PUBLIC'
                AND NOT "Users".banned
                AND NOT "Members".banned
            GROUP BY "Organisations".id;
        `;
    } else {
        query = `
            SELECT "Organisations".*, COUNT("Members"."userId") as user_count
            FROM "Organisations", "Members", "Users"
            WHERE "Organisations".id = "Members"."orgaId"
                AND "Users".id = "Members"."userId"
                AND NOT "Users".banned
                AND NOT "Members".banned
                AND "Organisations".id NOT IN (
                    SELECT "orgaId" AS id FROM "Members"
                    WHERE "Members"."userId" = $1 AND "Members".banned
                )
            GROUP BY "Organisations".id;
        `;
        params.push(user_id);
    }
    pool.query(query, params).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function getOrganisationById(org_id: string, req_user_id: string | null, consumer: Consumer<DatabaseOrganisation | null>, onError: ErrorHandler): void {
    let query: string;
    let params = [org_id];
    if(req_user_id === null) {
        query = 'SELECT * FROM "Organisations" WHERE id = $1 AND visibility = \'PUBLIC\';'
    } else {
        query = `
            SELECT * FROM "Organisations" AS "Orgs"
            WHERE id = $1
                AND NOT EXISTS (
                    SELECT "Organisations".id
                    FROM "Organisations", "Members"
                    WHERE "Organisations".id = $1
                        AND "Members"."orgaId" = "Organisations".id
                        AND "Members"."userId" = $2
                        AND "Members".banned
                );
        `;
        params.push(req_user_id);
    }
    pool.query(query, params).then(qres => {
        consumer(qres.rows.length > 0 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}


export function getBooksInOrg(org_id: string, connected: boolean, consumer: Consumer<DatabaseBookInOrg[]>, onError: ErrorHandler): void {
    let query: string;
    let params = [org_id];
    if(connected) {
        query = `
            SELECT "Books".*, SUM("Collections".num_shown) AS count
            FROM "Members", "Users", "Collections", "Books"
            WHERE "Members"."orgaId" = $1
                AND "Members"."userId" = "Users".id
                AND "Collections"."userId" = "Users".id
                AND "Collections"."bookId" = "Books".id
                AND "Collections".num_shown > 0
                AND NOT "Members".banned
            GROUP BY "Books".id;
        `;
    } else {
        query = `
            SELECT "Books".*, SUM("Collections".num_shown) AS count
            FROM "Members", "Users", "Collections", "Books"
            WHERE "Members"."orgaId" = $1
                AND "Members"."userId" = "Users".id
                AND "Collections"."userId" = "Users".id
                AND "Collections"."bookId" = "Books".id
                AND "Users".visibility = 'PUBLIC'
                AND "Collections".num_shown > 0
                AND NOT "Members".banned
            GROUP BY "Books".id;
        `;
    }
    pool.query(query, params).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}


export function getOrganisationsForUser(user_id: string, req_user_id: string | null, consumer: Consumer<UserDatabaseOrganisation[]>, onError: ErrorHandler): void {
    let query: string;
    let params = [user_id];
    if (req_user_id === null) {
        query = `
            SELECT "Organisations".*, role, banned 
            FROM "Organisations", "Members" 
            WHERE "Members"."userId" = $1 
                AND "Members"."orgaId" = "Organisations".id 
                AND "Organisations".visibility = 'PUBLIC';
        `;
    } else {
        query = `
            SELECT "Organisations".*, role, banned 
            FROM "Organisations", "Members" 
            WHERE "Members"."userId" = $1 
                AND "Members"."orgaId" = "Organisations".id 
                AND "Organisations".id NOT IN (
                    SELECT "orgaId" AS id FROM "Members"
                    WHERE "Members"."userId" = $2 AND "Members".banned
                );
        `;
        params.push(req_user_id);
    }
    pool.query(query, params).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function canSeeOrganisation(org_id: string, req_user_id: string | null, consumer: Consumer<boolean>, onError: ErrorHandler): void {
    let query: string;
    let params = [org_id];
    if(req_user_id === null) {
        query = `
            SELECT Count(*) 
            FROM "Organisations" 
            WHERE "Organisations".id = $1 AND "Organisations".visibility = 'PUBLIC';
        `;
    } else {
        query = `
            SELECT Count(*) 
            FROM "Organisations"
            WHERE "Organisations".id = $1
                AND $2 NOT IN (
                    SELECT "userId"
                    FROM "Members"
                    WHERE "Members"."orgaId" = $1
                        AND "Members".banned
                );
        `;
        params.push(req_user_id);
    }
    pool.query(query, params).then(qres => {
        consumer(qres.rows[0].count == 1);
    }).catch(e => manageError(e, onError));
}


export function getUsersInOrganisation(org_id: string, req_user_id: string, consumer: Consumer<OrganisationUser[]>, onError: ErrorHandler): void {
    pool.query(`
        SELECT "Users".*, "Members".banned AS "org_banned", "Members".role AS "org_role"
        FROM "Members", "Users"
        WHERE "Members"."userId" = "Users".id
            AND "Members"."orgaId" = $1
            AND (
                EXISTS (
                    SELECT * FROM "Users" WHERE id = $1 AND role = 'ADMIN'
                )
                OR EXISTS (
                    SELECT * FROM "Members"
                    WHERE "orgaId" = $1
                        AND "userId" = $2
                        AND NOT banned
                )
            );
    `, [org_id, req_user_id]).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}


export function joinOrganisation(org_id: string, user_id: string, callback: Consumer<boolean>, onError: ErrorHandler): void {
    pool.query(`
        INSERT INTO "Members" 
        VALUES ($1, $2, 'USER', false)
        ON CONFLICT DO NOTHING;`, [user_id, org_id]
    ).then(qres => {
        callback(qres.rowCount == 1);
    }).catch(e => manageError(e, onError));
}

export function leaveOrganisation(org_id: string, user_id: string, callback: Consumer<boolean>, onError: ErrorHandler): void {
    pool.query(`
        DELETE FROM "Members" 
        WHERE "userId" = $1 AND "orgaId" = $2
            AND NOT banned
            AND "userId" <> (
                SELECT "ownerId" FROM "Organisations" WHERE id = $2
            );
        `, [user_id, org_id]
    ).then(qres => {
        callback(qres.rowCount > 0);
    }).catch(e => manageError(e, onError));
}


export function isAdminInOrg(org_id: string, user_id: string, callback: Consumer<boolean | null>, onError: ErrorHandler): void {
    pool.query(`
            SELECT id, (
                EXISTS (
                    SELECT *
                    FROM "Members"
                    WHERE "userId" = $1
                        AND "orgaId" = $2
                        AND role = 'ADMIN'
                )
                OR EXISTS (
                    SELECT * FROM "Users" WHERE id = $1 AND role = 'ADMIN'
                )
            ) AS ok
            FROM "Organisations"
            WHERE id = $2;
        `, [user_id, org_id]
    ).then(qres => {
        callback(qres.rows.length > 0 ? qres.rows[0].ok : null);
    }).catch(e => manageError(e, onError));
}

export function setUserOrgRole(org_id: string, user_id: string, role: Role, callback: Consumer<boolean>, onError: ErrorHandler): void {
    pool.query(`
            UPDATE "Members"
            SET role = $3::"Role"
            WHERE "userId" = $1 AND "orgaId" = $2;
        `, [user_id, org_id, role]
    ).then(qres => {
        callback(qres.rowCount > 0);
    }).catch(e => manageError(e, onError));
}

export function setUserOrgBan(org_id: string, user_id: string, ban: boolean, callback: Consumer<boolean>, onError: ErrorHandler): void {
    const query = `
        UPDATE "Members"
        SET banned = $3
        WHERE "userId" = $1 AND "orgaId" = $2 AND role <> 'ADMIN';
    `;
    pool.query(query, [user_id, org_id, ban]
    ).then(qres => {
        callback(qres.rowCount > 0);
    }).catch(e => manageError(e, onError));
}
