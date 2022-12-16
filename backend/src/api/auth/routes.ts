import router from "../../core/router";
import { validateEmail } from "../../globals";
import { deleteToken, AUTH_COOKIE, deleteAllTokens } from "../../core/auth/authentication";
import UserCreationDTO from "../../dto/user_creation_request";
import UserLoginDTO from "../../dto/user_login";
import { checkUserUniqueness, createUser, deleteUser, getUserByEmail, getUserById, updateUserPassword } from "../../database/queries/users";
import UserCreationErrorDTO from "../../dto/user_creation_error";
import { checkHash, newHash } from "./hashing";
import { setAuthCookie, clearAuthCookie } from "./cookies";
import ChangePasswordDTO from "src/dto/auth/change_password";
import { authenticated } from "./middlewares";
import PasswordDTO from "src/dto/auth/password";

// Waits for a random delay when a bad request occurs to avoid spamming
function delay(): Promise<void> {
	const duration_ms = Math.floor(Math.random() * 1000) + 1000;
	return new Promise(resolve => setTimeout(resolve, duration_ms));
}

/**
 * Sign in route
 */
router.post('/signin', async (req, res) => {
	const dto: UserCreationDTO = req.body;
	const email = dto.email.trim();
	let error_body: UserCreationErrorDTO = {
		name: validateEmail(email),
		password: dto.password.length >= 8
	};
	if(!error_body.name) {
		await delay();
		res.status(400).json(error_body).end();
		return;
	}
	checkUserUniqueness(dto.email, dto.username, async name_ok => {
		if(!error_body.password || !name_ok) {
			await delay();
			error_body.name = name_ok;
			res.status(400).json(error_body).end();
			return;
		}
		const [hash, salt] = newHash(dto.password);
		createUser(email, dto.username, hash, salt, uuid => {
			setAuthCookie(uuid, res);
			res.json({ user_id: uuid }).end();
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500));
});


/**
 * Log in route
 */
router.post('/login', (req, res) => {
	const dto: UserLoginDTO = req.body;
	getUserByEmail(dto.email, async db_user => {
		if(db_user !== null && checkHash(dto.password, db_user.password, db_user.salt)) {
			setAuthCookie(db_user.id, res);
			res.send({ user_id: db_user.id });
			return;
		}
		await delay();
		res.sendStatus(400);
		return;
	}, _ => res.sendStatus(500));
});


/**
 * Log out route
 */
router.post('/logout', (req, res) => {
	const token: string | undefined = req.cookies[AUTH_COOKIE];
	if(token !== undefined) {
		deleteToken(token);
	}
	clearAuthCookie(res);
	res.send();
});


/**
 * Change password route
 */
router.post('/password', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const dto: ChangePasswordDTO = req.body;
	getUserById(req_user_id, async db_user => {
		if(db_user !== null && checkHash(dto.old_password, db_user.password, db_user.salt)) {
			const [hash, salt] = newHash(dto.new_password);
			updateUserPassword(db_user.id, hash, salt,
				() => res.send(), 
				_  => res.sendStatus(500)
			);
			return;
		}
		await delay();
		res.sendStatus(400);
		return;
	}, _ => res.sendStatus(500));
});


/**
 * Delete user route
 */
router.post('/signout', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const dto: PasswordDTO = req.body;
	getUserById(req_user_id, async db_user => {
		if(db_user !== null && checkHash(dto.password, db_user.password, db_user.salt)) {
			deleteAllTokens(db_user.id);
			deleteUser(db_user.id,
				() => res.send(), 
				_  => res.sendStatus(500)
			);
			return;
		}
		await delay();
		res.sendStatus(400);
		return;
	}, _ => res.sendStatus(500));
});
