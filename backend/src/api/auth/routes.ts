import router from "../../core/router";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { generateToken, AUTH_COOKIE } from "../../core/auth/authentication";
import { Response } from "express";
import UserCreationDTO from "src/dto/user_creation_request";
import UserLoginDTO from "src/dto/user_login";
import { EMAIL_REGEX } from "../../globals";

function setAuthCookie(user_id: string, res: Response) {
	const token = generateToken(user_id);
	res.cookie(AUTH_COOKIE, token, {httpOnly: true, sameSite: 'strict'});
}


router.post('/signin', (req, res) => {
	const dto: UserCreationDTO = req.body;
	if(dto.password.length < 8 || !EMAIL_REGEX.test(dto.email)) {
		res.sendStatus(400);
		return;
	}
	// TODO Check uniqueness constraints on username and email
	const user_id = uuidv4();
	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(dto.password, salt);
	// TODO Entry to database
	const user = {

	}
	setAuthCookie(user_id, res);
	res.json({user_id: user_id});
});

router.post('/login', (req, res) => {
	const dto: UserLoginDTO = req.body;
	if(false) { // ! user.exists
		res.sendStatus(400);
		return;
	}
	setAuthCookie('todo: user_id from database', res);
	res.send();
});

