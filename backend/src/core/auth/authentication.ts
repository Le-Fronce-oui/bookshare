import jwt from "jsonwebtoken";
import HashMap from "hashmap";
import { JWT_KEY } from "../../utils/env";

const AUTH_COOKIE = '__bs_token';

const tokens = new HashMap<string,string[]>();


function generateToken(user_id: string): string {
	const token = jwt.sign({user_id: user_id}, JWT_KEY);
	if(!tokens.has(user_id)) {
		tokens.set(user_id, [token]);
	} else {
		tokens.get(user_id)?.push(token);
	}
	return token;
}

function checkToken(token: string): any | null {
	try {
		const decoded = jwt.verify(token, JWT_KEY);
		console.log(decoded);
		return decoded // TODO check the format of this thing
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
	const user_tokens = tokens.get(user_id)!;
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

