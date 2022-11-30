import { Pool } from "pg";
require('dotenv').config()

function connect() {
    var pool = new Pool({
        user: process.env.DATABASE_USER,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: String(process.env.DATABASE_PASSWORD),
        port: 5432,
    });
    return pool;
}

export { connect };