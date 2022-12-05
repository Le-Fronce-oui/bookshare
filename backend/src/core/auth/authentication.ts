import jwt from "jsonwebtoken";
import HashMap from "hashmap";
import { JWT_KEY } from "../../utils/env";

const AUTH_COOKIE = '__bs_token';

const issuer = 'BookStack'

const tokens = new HashMap<string,string[]>();

interface TokenPayload {
	user_id: string
}


function generateToken(user_id: string): string {
	const token = jwt.sign({user_id: user_id}, JWT_KEY, { issuer: issuer });
	if(tokens.has(user_id)) {
		tokens.get(user_id)?.push(token);
	} else {
		tokens.set(user_id, [token]);
	}
	return token;
}

function checkToken(token: string): any | null {
	try {
		const decoded = jwt.verify(token, JWT_KEY, { issuer: issuer }) as TokenPayload;
		const user_tokens = tokens.get(decoded.user_id);
		if(user_tokens === undefined || !user_tokens.includes(token)) {
			return false;
		}
		return decoded.user_id;
	} catch(err) {
		console.error(err);
		return null;
	}
}

function deleteToken(token: string): boolean {
	const user_id = checkToken(token);
	if(user_id === null) {
		return false;
	}
	const user_tokens = tokens.get(user_id);
	if(user_tokens === undefined) {
		return false;
	}
	const index = user_tokens.indexOf(token);
	if(index > 0) {
		user_tokens.splice(index, 1);
	}
	return true;
}

function deleteAllTokens(user_id: string) {
	tokens.delete(user_id);
}


export { generateToken, checkToken, deleteToken, deleteAllTokens, AUTH_COOKIE };

