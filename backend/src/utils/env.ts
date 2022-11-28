
const isProd = (process.env.BS_PRODUCTION === 'true');

type BsEnvKey = 'BS_JWT_KEY';

const defaults = {
	'BS_JWT_KEY': isProd ? '' : 'BS_DEV_JWT_KEY'
}

function getEnv(name: BsEnvKey): string {
	return (name in process.env) ? (process.env[name] as string) : defaults[name];
}

const JWT_KEY = getEnv('BS_JWT_KEY');

if(JWT_KEY === '') {
	console.error('No JWT key provided');
	process.exit(1);
}

export { JWT_KEY };
