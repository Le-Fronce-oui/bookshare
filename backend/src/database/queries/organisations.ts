import { Consumer, ErrorHandler } from "src/types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";
import { DatabaseOrganisation, UserDatabaseOrganisation } from "../models/organisations";


export function getOrganisations(consumer: Consumer<DatabaseOrganisation[]>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Organisations";').then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function getOrganisationById(organisation_id: string, consumer: Consumer<DatabaseOrganisation | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Organisations" WHERE id = $1;', [organisation_id]).then(qres => {
        consumer(qres.rows.length > 0 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}


export function getOrganisationsForUser(user_id: string, consumer: Consumer<UserDatabaseOrganisation[]>, onError?: ErrorHandler) {
    pool.query(`
        SELECT "Organisations".*, role, banned 
        FROM "Organisations", "Members" 
        WHERE "Members"."userId" = $1 AND "Members"."orgaId" = "Organisations".id;
    `, [user_id]).then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}
