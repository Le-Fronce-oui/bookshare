import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../../database/queries/users';
import { checkToken, AUTH_COOKIE } from "../../core/auth/authentication";
import { clearAuthCookie } from './cookies';


function getAuthentifiedUser(req: Request, res: Response) {
	const token = req.cookies[AUTH_COOKIE];
	if(token === undefined || token.length == 0) {
		return;
	}
	const user_id = checkToken(token);
	if(user_id !== null) {
		getUserById(user_id, db_user => {
			if(db_user === null) {
				clearAuthCookie(res);
				return;
			}
			if(db_user.banned) {
				req.earlyReject = true;
				res.sendStatus(403);
				return;
			}
			req.user = {
				uuid: db_user.id,
				role: db_user.role,
				visibility: db_user.visibility
			}
		});
	} else {
		clearAuthCookie(res);
	}
}



function auth(req: Request, res: Response, next: NextFunction) {
	getAuthentifiedUser(req, res);
	if(!req.earlyReject) {
		next();
	}
}

function authenticated(else_code: number = 401) {
	return function(req: Request, res: Response, next: NextFunction) {
		if(req.user === undefined) {
			res.sendStatus(else_code);
			return;
		}
		next();
	}
}

function isAdmin(else_code: number) {
	return function(req: Request, res: Response, next: NextFunction) {
		if(req.user?.role === 'ADMIN') {
			res.sendStatus(else_code);
			return;
		}
		next();
	}
}

export { auth, authenticated, isAdmin };
