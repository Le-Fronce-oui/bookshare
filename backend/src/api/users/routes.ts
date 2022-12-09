import { addBookToCollection, getUserById } from "../../database/queries/users";
import UserConnectedDTO from "../../dto/user_connected";
import AuthenticatedUser from "../../types/internal/authenticated_user";
import { updateUserVisibility } from "../../database/queries/users";
import UserVisibilityDTO from "../../dto/users/visibility";
import router from "../../core/router";
import { authenticated } from "../auth/middlewares";
import Visibility from "../../database/models/visibility";
import { getBooksForUser } from "../../database/queries/books";
import { getOrganisationsForUser } from "../../database/queries/organisations";


router.get('/user/connected', authenticated(401), (req, res) => {
	const user: AuthenticatedUser = req.user!;
	getBooksForUser(user.uuid, books => {
		getOrganisationsForUser(user.uuid, organisations => {
			let body: UserConnectedDTO = {
				id: user.uuid,
				username: user.username,
				role: user.role,
				organisations: organisations.map(o => ({
					id: o.id,
					name: o.name,
					role: o.role,
					owned: o.owner_id == user.uuid
				})),
				books: books.map(b => ({
					id: b.id,
					name: b.name,
					cover: b.cover,
					count: b.num_owned
				}))
			}
			res.json(body);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500));
});


router.get('/user/:userId/info', (req, res) => {
	const id = req.params.userId
	getUserById(id, db_user => {
		if (db_user == null) {
			res.sendStatus(404);
			return;
		}
		if (db_user.visibility != 'PUBLIC' && req.user === undefined) {
			res.sendStatus(404);
			return;
		} else {
			let body: UserConnectedDTO = {
				id: db_user.id,
				username: db_user.username,
				role: db_user.role,
				organisations: [],
				books: []
			}
		}
	})
	res.json('todo');
	
});


router.get('/user/:userId/visibility', authenticated(401), (req, res) => {
	if (req.user?.uuid !== req.params.userId) {
		res.sendStatus(403);
		return;
	}
	const body: UserVisibilityDTO = {
		visibility: req.user?.visibility!
	};
	res.json(body);
});

router.post('/user/:userId/visibility', authenticated(401), (req, res) => {
	if (req.user?.uuid !== req.params.userId) {
		res.sendStatus(403);
		return;
	}
	const visibility = req.query.visibility as Visibility;
	if (visibility !== 'PUBLIC' && visibility !== 'RESTRICTED') {
		res.sendStatus(400);
	}
	updateUserVisibility(req.user?.uuid!, visibility, () => { res.sendStatus(200) }, _ => { res.sendStatus(500) });
});


router.put('/user/:user_id/book/:book_id', authenticated(401), (req, res) => {
	if (req.user?.uuid !== req.params.user_id) {
		res.sendStatus(403);
		return;
	}
	let body: {owned?: number, shown?: number} = req.body;
	if(body === undefined) {
		body = { };
	}
	const owned = body.owned ?? 1; 
	const shown = body.shown ?? 0;
	if(owned < 1 || shown < 0 || shown > owned) {
		res.sendStatus(400);
	}
	addBookToCollection(req.params.user_id, req.params.book_id, owned, shown, 
		() => res.sendStatus(200), 
		_ => res.sendStatus(500)
	);
});


router.get('/user/:userId/loans', authenticated(401), (req, res) => {
	if (req.user?.uuid !== req.params.userId) {
		res.sendStatus(403);
	} else {
		res.json('todo');
	}
});