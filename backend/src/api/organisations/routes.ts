import { getBookInOrganisation } from "../../database/queries/books";
import { canSeeOrganisation, getAllOrganisations, getBooksInOrg, getOrganisationById, getUsersInOrganisation, isAdminInOrg, joinOrganisation, leaveOrganisation, setUserOrgBan, setUserOrgRole } from "../../database/queries/organisations";
import BookInOrgDTO from "../../dto/books/in_org";
import router from "../../core/router";
import ShortOrganisationDTO from "src/dto/organisations/short";
import { authenticated } from "../auth/middlewares";
import { getUserById } from "../../database/queries/users";
import OrganisationDTO from "../../dto/organisations/full";
import OrganisationMembersDTO from "src/dto/organisations/members";


router.get('/organisations/short', (req, res) => {
	const req_user_id = req.user !== undefined ? req.user.uuid : null;
	getAllOrganisations(req_user_id, organisations => {
		let body: ShortOrganisationDTO[] = organisations.map(o => ({
			id: o.id,
			name: o.name, 
			user_count: o.user_count
		}));
		res.json(body);
	}, _ => res.sendStatus(500))
});


router.get('/organisation/:org_id', (req, res) => {
	const org_id = req.params.org_id;
	const req_user_id = req.user !== undefined ? req.user.uuid : null;
	getOrganisationById(org_id, req_user_id, org => {
		if(org == null) {
			res.sendStatus(404);
			return;
		}
		let body: OrganisationDTO = {
			id: org.id,
			name: org.name,
			desc: org.desc,
			owner: null,
			books: []
		}
		getUserById(org.ownerId, owner => {
			if(owner !== null && (owner.visibility === 'PUBLIC' || req.user !== undefined)) {
				body.owner = {
					id: owner.id,
					username: owner.username
				}
			}
			getBooksInOrg(org.id, req.user !== undefined, books => {
				body.books = books.map(b => ({
					id: b.id,
					name: b.name,
					cover: b.cover,
					count: b.count
				}));
				res.json(body);
			}, _ => res.sendStatus(500));
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});


router.post('/organisation/:org_id/join/:user_id', authenticated(401), (req, res) => {
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	if(user_id !== req.user?.uuid) {
		res.sendStatus(403);
		return;
	}
	joinOrganisation(org_id, user_id, joined => {
		res.sendStatus(joined ? 200 : 400);
	}, _ => res.sendStatus(500));
});

router.post('/organisation/:org_id/leave/:user_id', authenticated(401), (req, res) => {
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	if(user_id !== req.user?.uuid) {
		res.sendStatus(403);
		return;
	}
	leaveOrganisation(org_id, user_id, left => {
		res.sendStatus(left ? 200 : 400);
	}, _ => res.sendStatus(500));
});



router.get('/organisation/:org_id/book/:book_id', (req, res) => {
	const user_id = req.user !== undefined ? req.user.uuid : null;
	const org_id = req.params.org_id;
	const book_id = req.params.book_id;
	canSeeOrganisation(org_id, user_id, canSee => {
		if(!canSee) {
			res.sendStatus(404);
			return;
		}
		getBookInOrganisation(org_id, book_id, user_id, booksInOrg => {
			let body: BookInOrgDTO[] = booksInOrg.map(b => ({
				user_id: b.user_id,
				username: b.username,
				owned: b.owned,
				available: Math.max(0, b.owned - b.lent)
			}))
			res.json(body);
		}, _ => res.sendStatus(500))
	}, _ => res.sendStatus(500));
});


router.get('/organisation/:org_id/members', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	getUsersInOrganisation(org_id, req_user_id, users => {
		if(users.length === 0) {
			res.sendStatus(404);
			return;
		}
		getOrganisationById(org_id, req_user_id, org => {
			if(org === null) {
				res.sendStatus(404);
				return;
			}
			let body: OrganisationMembersDTO = {
				owner: org.ownerId,
				members: users.map(u => ({
					id: u.id,
					username: u.username,
					admin: u.role === 'ADMIN',
					banned: u.org_banned,
					org_role: u.org_role
				}))
			};
			res.json(body);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500));
});


router.post('/organisation/:org_id/ban/:user_id', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	isAdminInOrg(org_id, req_user_id, ok => {
		if(ok === null) {
			res.sendStatus(404);
			return;
		}
		if(!ok) {
			res.sendStatus(403);
			return;
		}
		setUserOrgBan(org_id, user_id, true, ok => {
			res.sendStatus(ok ? 200 : 400);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});

router.delete('/organisation/:org_id/ban/:user_id', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	isAdminInOrg(org_id, req_user_id, ok => {
		if(ok === null) {
			res.sendStatus(404);
			return;
		}
		if(!ok) {
			res.sendStatus(403);
			return;
		}
		setUserOrgBan(org_id, user_id, false, ok => {
			res.sendStatus(ok ? 200 : 400);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});


router.post('/organisation/:org_id/admin/:user_id', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	getOrganisationById(org_id, req_user_id, org => {
		if(org === null) {
			res.sendStatus(404);
			return;
		}
		if(org.ownerId !== req_user_id) {
			res.sendStatus(403);
			return;
		}
		setUserOrgRole(org_id, user_id, 'ADMIN', ok => {
			res.sendStatus(ok ? 200 : 400);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});

router.delete('/organisation/:org_id/admin/:user_id', authenticated(401), (req, res) => {
	const req_user_id = req.user?.uuid as string;
	const org_id = req.params.org_id;
	const user_id = req.params.user_id;
	getOrganisationById(org_id, req_user_id, org => {
		if(org === null) {
			res.sendStatus(404);
			return;
		}
		if(org.ownerId !== req_user_id) {
			res.sendStatus(403);
			return;
		}
		setUserOrgRole(org_id, user_id, 'USER', ok => {
			res.sendStatus(ok ? 200 : 400);
		}, _ => res.sendStatus(500));
	}, _ => res.sendStatus(500))
});

	
