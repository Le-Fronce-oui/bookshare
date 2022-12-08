import { userInfo } from "os";
import { getUserById } from "src/database/queries/users";
import UserConnectedDTO from "src/dto/user_connected";
import AuthenticatedUser from "src/types/internal/authenticated_user";
import { DATABASE_USER } from "src/utils/env";
import { updateUserVisibility } from "../../database/queries/users";
import UserVisibilityDTO from "../../dto/users/visibility";
import router from "../../core/router";
import { authenticated } from "../auth/middlewares";
import Visibility from "../../database/models/visibility";


router.get('/user/connected', authenticated(401), (req, res) => {
	const user: AuthenticatedUser = req.user!;
	let body: UserConnectedDTO = {
		id: user.uuid,
		username: user.username,
		role: user.role,
		organisations: [] // TODO get from database
	}
	res.json(body);
});


router.get('/user/:userId/info', (req, res) => {
	const id = req.params.userId
	getUserById(id, db_user => {
		if (db_user == null) {
			res.sendStatus(404)
			return
		}
		if (db_user.visibility != 'PUBLIC' && req.user === undefined) {
			res.sendStatus(404)
			return
		} else {
			let body: UserConnectedDTO = {
				id: db_user.id,
				username: db_user.username,
				role: db_user.role,
				organisations: []
			}
		}
	})
	res.json('todo');
	router.get('/user/:userId/visibility', authenticated(401), (req, res) => {
		if (req.user?.uuid !== req.params.userId) {
			res.sendStatus(403);
		}
		const body: UserVisibilityDTO = {
			visibility: req.user?.visibility!
		};
		res.json(body);
	});

	router.post('/user/:userId/visibility', authenticated(401), (req, res) => {
		if (req.user?.uuid !== req.params.userId) {
			res.sendStatus(403);
		}
		const visibility = req.query.visibility as Visibility;
		if (visibility !== 'PUBLIC' && visibility !== 'RESTRICTED') {
			res.sendStatus(400);
		}
		updateUserVisibility(req.user?.uuid!, visibility, () => { res.sendStatus(200) }, _ => { res.sendStatus(500) });
	});
});
