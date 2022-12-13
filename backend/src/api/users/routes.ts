import { addBookToCollection, getAllUsers, getUserById, setUserSiteBan, setUserSiteRole } from "../../database/queries/users";
import UserConnectedDTO from "../../dto/user_connected";
import AuthenticatedUser from "../../types/internal/authenticated_user";
import { setUserVisibility } from "../../database/queries/users";
import router from "../../core/router";
import { authenticated, isAdmin } from "../auth/middlewares";
import Visibility from "../../database/models/visibility";
import { getBooksForUser } from "../../database/queries/books";
import { getOrganisationsForUser } from "../../database/queries/organisations";
import ShortUserDTO from "src/dto/users/short";
import { Consumer, Callable } from "src/types/functions";
import UserDTO, { UserBookGenericDTO } from "src/dto/users/full";
import { UserDatabaseBook } from "src/database/models/book";
<<<<<<< HEAD
import ShortUserBookDTO from "src/dto/books/short_user";
import DetailedUserDTO from "src/dto/users/detailed";
import FullUserBookDTO from "src/dto/books/full_user";
=======
import { getLoansForUser } from "src/database/queries/loans";
>>>>>>> dev-49


function fillUserData<T>(dto: UserBookGenericDTO<T>, req_user_id: string | null, bookMapper: (book: UserDatabaseBook) => T | null, 
		callback: Consumer<UserBookGenericDTO<T>>, onError: Callable): void {
	getBooksForUser(dto.id, books => {
		getOrganisationsForUser(dto.id, req_user_id, organisations => {
			dto.organisations = organisations.map(o => ({
				id: o.id,
				name: o.name,
				role: o.role,
				owned: o.ownerId == dto.id
			}));
			dto.books = books.map(bookMapper).filter(b => b !== null) as T[];
			callback(dto);
		}, _ => onError());
	}, _ => onError());
}


const CONNECTED_BOOK_MAPPER: (b: UserDatabaseBook) => ShortUserBookDTO = b => {
	return {
		id: b.id,
		name: b.name,
		cover: b.cover,
		count: b.num_owned
	}
};

router.get('/user/connected', authenticated(401), (req, res) => {
	const user: AuthenticatedUser = req.user!;
	let body: UserConnectedDTO = {
		id: user.uuid,
		username: user.username,
		role: user.role,
		organisations: [],
		books: []
	}
	fillUserData(body, user.uuid, CONNECTED_BOOK_MAPPER, body => res.json(body), () => res.sendStatus(500));
});


router.get('/users/short', authenticated(401), isAdmin(403), (req, res) => {
	getAllUsers(users => {
		let body: ShortUserDTO[] = users.map(u => ({
			id: u.id,
			username: u.username,
			admin: u.role === 'ADMIN',
			banned: u.banned
		}));
		res.json(body);
	}, _ => res.sendStatus(500));
});


const PUBLIC_BOOK_MAPPER: (b: UserDatabaseBook) => ShortUserBookDTO = b => {
	return {
		id: b.id,
		name: b.name,
		cover: b.cover,
		count: b.num_shown
	}
};

router.get('/user/:user_id', (req, res) => {
	const user_id = req.params.user_id;
	const req_user_id = req.user !== undefined ? req.user.uuid : null;
	getUserById(user_id, db_user => {
		if (db_user == null) {
			res.sendStatus(404);
			return;
		}
		if ((db_user.visibility !== 'PUBLIC' && req.user === undefined) || (db_user.banned && req.user?.role !== 'ADMIN')) {
			res.sendStatus(404);
			return;
		}
		let body: UserDTO = {
			id: db_user.id,
			username: db_user.username,
			role: db_user.role,
			organisations: [],
			books: []
		};
		let countMapper = (req_user_id === user_id) ? CONNECTED_BOOK_MAPPER : PUBLIC_BOOK_MAPPER;
		fillUserData(body, req_user_id, countMapper, body => res.json(body), () => res.sendStatus(500));
	}, _ => res.sendStatus(500));
});


const FULL_BOOK_MAPPER: (b: UserDatabaseBook) => FullUserBookDTO = b => {
	return {
		id: b.id,
		name: b.name,
		cover: b.cover,
		owned: b.num_owned,
		shown: b.num_shown,
		lent: b.num_lent
	}
};

router.get('/user/:user_id/detailed', authenticated(401), (req, res) => {
	const user_id = req.params.user_id;
	const req_user_id = req.user?.uuid;
	if(req_user_id !== user_id) {
		res.sendStatus(403);
		return;
	}
	getUserById(user_id, db_user => {
		if(db_user === null) {
			res.sendStatus(404);
			return;
		}
		let body: DetailedUserDTO = {
			id: db_user.id,
			username: db_user.username,
			role: db_user.role,
			visibility: db_user.visibility,
			organisations: [],
			books: []
		};
		fillUserData(body, req_user_id, FULL_BOOK_MAPPER, body => res.json(body), () => res.sendStatus(500));
	}, _ => res.sendStatus(500));
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
	setUserVisibility(req.user?.uuid!, visibility, () => { res.sendStatus(200) }, _ => { res.sendStatus(500) });
});

router.post('/user/:user_id/admin', authenticated(401), isAdmin(403), (req, res) => {
	setUserSiteRole(req.params.user_id, 'ADMIN', ok => {
		res.sendStatus(ok ? 200 : 400)
	}, _ => res.sendStatus(500));
});

router.post('/user/:user_id/access', authenticated(401), isAdmin(403), (req, res) => {
	let ban = req.query.ban;
	if(ban !== 'true' && ban !== 'false') {
		res.sendStatus(400);
		return;
	}
	setUserSiteBan(req.params.user_id, ban === 'true', ok => {
		res.sendStatus(ok ? 200 : 400)
	}, _ => res.sendStatus(500));
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
		getLoansForUser(req.params.userId, loans => {
			res.json(loans);
		}, _ => res.sendStatus(500));
	}
});