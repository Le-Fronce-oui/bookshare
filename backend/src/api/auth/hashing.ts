import bcrypt from "../../types/bcrypt";

export function newHash(cleartext: string): [string, string] {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(cleartext, salt);
	return [hash, salt];
}

export function checkHash(secret: string, hash: string, salt: string): boolean {
	return hash === bcrypt.hashSync(secret, salt);
}