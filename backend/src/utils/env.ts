import * as dotenv from 'dotenv'

dotenv.config();

const defaults: {[name: string]: string} = {
	'BS_DATABASE_USER': 'bookshare',
	'BS_DATABASE_HOST': 'localhost',
	'BS_DATABASE_NAME': 'bookshare',
	'BS_DATABASE_PORT': '5432'
}

function getEnv(name: string): string {
	if(name in process.env) {
		return process.env[name] as string;
	}
	if(name in defaults) {
		return defaults[name];
	}
	console.error("No value provided for environment variable " + name);
	process.exit(1);
}


export const JWT_KEY = getEnv('BS_JWT_KEY');

export const DATABASE_USER = getEnv('BS_DATABASE_USER');
export const DATABASE_HOST = getEnv('BS_DATABASE_HOST');
export const DATABASE_NAME = getEnv('BS_DATABASE_NAME');
export const DATABASE_PASS = getEnv('BS_DATABASE_PASS');
export const DATABASE_PORT = parseInt(getEnv('BS_DATABASE_PORT'));

if (DATABASE_PORT === NaN) {
	console.error('Bad database port');
	process.exit(1);
}
