import { Request, Response, NextFunction } from 'express';
import { checkToken, AUTH_COOKIE } from "../../core/auth/authentication";

function getAuthentifiedUser(req: Request) {
	const token = req.cookies[AUTH_COOKIE];
	if(token === undefined) {
		console.log('No token');
		return;
	}
	const user_id = checkToken(token);
	if(user_id !== null) {
		req.user = user_id; // TODO get user from database
	}
	console.log(user_id !== null ? 'authentified' : 'not authentified');
}



function auth(req: Request, _res: Response, next: NextFunction) {
	getAuthentifiedUser(req);
	next();
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
		if(req.user === undefined) { // TODO !res.user.admin
			res.sendStatus(else_code);
			return;
		}
		next();
	}
}

export { auth, authenticated };
