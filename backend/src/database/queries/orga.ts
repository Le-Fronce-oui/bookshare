import { Consumer, ErrorHandler } from "src/types/functions";
import { pool } from "../connect";
import { manageError } from "../errors";


export function getOrganisations(consumer: Consumer<DatabaseOrga[]>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Organisations";').then(qres => {
        consumer(qres.rows);
    }).catch(e => manageError(e, onError));
}

export function getOrganisationById(organisation_id: string, consumer: Consumer<DatabaseOrga | null>, onError?: ErrorHandler) {
    pool.query('SELECT * FROM "Organisations" WHERE id = $1;', [organisation_id]).then(qres => {
        consumer(qres.rows.length > 0 ? qres.rows[0] : null);
    }).catch(e => manageError(e, onError));
}
