import { generateToken, AUTH_COOKIE } from "../../core/auth/authentication";
import { Response } from "express";


export function setAuthCookie(user_id: string, res: Response) {
	const token = generateToken(user_id);
	res.cookie(AUTH_COOKIE, token, { httpOnly: true, sameSite: 'strict' });
}

export function clearAuthCookie(res: Response) {
	res.cookie(AUTH_COOKIE, '', { httpOnly: true, sameSite: 'strict', expires: new Date(0) });
}
