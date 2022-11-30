import { pool } from "../connect";
import { Consumer } from 'src/types/functions';
import DatabaseUser from '../models/user';


export function getUsers(request: any, response: any) {
    pool.query('SELECT * FROM "User";', (error: any, results: any) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

export function getUserById(request: any, response: any) {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error: any, results: any) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

export function createUser(request: any, response: any) {
    const { name, email } = request.body;

    pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email],
        (error: any, results: any) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        }
    );
}

export function updateUser(request: any, response: any) {
    const id = parseInt(request.params.id);
    const { name, email } = request.body;

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id],
        (error: any, results: any) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        }
    );
}

export function deleteUser(request: any, response: any) {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM users WHERE id = $1', [id], (error: any, results: any) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
}
