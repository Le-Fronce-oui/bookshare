import { getBookInOrganisation } from "../../database/queries/books";
import { canSeeOrganisation, getAllOrganisations, joinOrganisation, leaveOrganisation } from "../../database/queries/organisations";
import BookInOrgDTO from "../../dto/books/in_org";
import router from "../../core/router";
import ShortOrganisationDTO from "src/dto/organisations/short";
import { authenticated } from "../auth/middlewares";


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
	let user_id = req.user !== undefined ? req.user.uuid : null;
	let org_id = req.params.org_id;
	let book_id = req.params.book_id;
	canSeeOrganisation(org_id, user_id, canSee => {
		if(!canSee) {
			res.sendStatus(404);
			return;
		}
		getBookInOrganisation(org_id, book_id, user_id !== null, booksInOrg => {
			let body: BookInOrgDTO[] = booksInOrg.map(b => ({
				user_id: b.user_id,
				username: b.username,
				owned: b.owned,
				available: Math.max(0, b.owned - b.lent)
			}))
			res.json(body);
		}, _ => res.sendStatus(500))
	}, _ => res.sendStatus(500));
})

	
