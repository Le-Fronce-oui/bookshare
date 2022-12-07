import { updateUserVisibility } from "../../database/queries/users";
import UserVisibilityDTO from "../../dto/users/visibility";
import UserConnectedDTO from "../../dto/user_connected";
import AuthenticatedUser from "../../types/internal/authenticated_user";
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


router.get('/user/:userId/visibility', authenticated(401), (req, res) => {
	if(req.user?.uuid !== req.params.userId) {
		res.sendStatus(403);
	}
	const body: UserVisibilityDTO = {
		visibility: req.user?.visibility!
	};
	res.json(body);
});

router.post('/user/:userId/visibility', authenticated(401), (req, res) => {
	if(req.user?.uuid !== req.params.userId) {
		res.sendStatus(403);
	}
	const visibility = req.query.visibility as Visibility;
	if(visibility !== 'PUBLIC' && visibility !== 'RESTRICTED') {
		res.sendStatus(400);
	}
	updateUserVisibility(req.user?.uuid!, visibility, () => { res.sendStatus(200) }, _ => { res.sendStatus(500) });
});



