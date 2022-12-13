import { Consumer, ErrorHandler } from "src/types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";
import { DatabaseOrganisation, DatabaseOrganisationWithCount, UserDatabaseOrganisation } from "../models/organisations";


export function getAllOrganisations(user_id: string | null, consumer: Consumer<DatabaseOrganisationWithCount[]>, onError: ErrorHandler) {
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
        let res = qres.rows;
        res.forEach(row => row.user_count = parseInt(row.user_count));
        consumer(res);
    }).catch(e => manageError(e, onError));
}

export function getOrganisationById(organisation_id: string, consumer: Consumer<DatabaseOrganisation | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Organisations" WHERE id = $1;', [organisation_id]).then(qres => {
        consumer(qres.rows.length > 0 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}


export function getOrganisationsForUser(user_id: string, req_user_id: string | null, consumer: Consumer<UserDatabaseOrganisation[]>, onError?: ErrorHandler) {
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

export function canSeeOrganisation(org_id: string, req_user_id: string | null, consumer: Consumer<boolean>, onError?: ErrorHandler) {
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
            FROM "Organisations", "Members"
            WHERE "Organisations".id = $1 AND "Members"."orgaId" = "Organisations".id
                AND "Members"."userId" = $2;
                AND "Members".banned = false;
        `;
        params.push(req_user_id);
    }
    pool.query(query, params).then(qres => {
        consumer(qres.rows[0].count == 1);
    }).catch(e => manageError(e, onError));
}


export function joinOrganisation(org_id: string, user_id: string, callback: Consumer<boolean>, onError: ErrorHandler) {
    pool.query(`
        INSERT INTO "Members" 
        VALUES ($1, $2, 'USER', false)
        ON CONFLICT DO NOTHING;`, [user_id, org_id]
    ).then(qres => {
        callback(qres.rowCount == 1);
    }).catch(e => manageError(e, onError));
}

export function leaveOrganisation(org_id: string, user_id: string, callback: Consumer<boolean>, onError: ErrorHandler) {
    pool.query(`
        DELETE FROM "Members" 
        WHERE "userId" = $1 AND "orgaId" = $2
            AND NOT banned
            AND "userId" <> (
                SELECT "ownerId" FROM "Organisations" WHERE id = $2
            );`, [user_id, org_id]
    ).then(qres => {
        callback(qres.rowCount > 0);
    }).catch(e => manageError(e, onError));
}
