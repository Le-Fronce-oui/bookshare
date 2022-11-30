import { Pool } from "pg";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASS, DATABASE_PORT, DATABASE_USER } from "../utils/env"


export const pool = new Pool({
    user: DATABASE_USER,
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    password: DATABASE_PASS,
    port: DATABASE_PORT,
});