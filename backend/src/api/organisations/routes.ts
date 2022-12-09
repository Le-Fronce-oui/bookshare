import { getBookInOrganisation } from "../../database/queries/books";
import { canSeeOrganisation } from "../../database/queries/organisations";
import BookInOrgDTO from "../../dto/books/in_org";
import router from "../../core/router";

router.get('/org/:orgId', (req, res) => {
	req.params.orgId;
	
	res.json("todo")
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

	


router.get('/org/:orgId/prints', (req, res) => {
	// TODO
	res.json('todo');
});

router.get('/org/:orgId/users', (req, res) => {
	// TODO
	// For each user : username, number of books
	// Join date ?
	res.json('todo');
});

router.post('/org/:orgId/join/:userId', (req, res) => {
	// TODO
	// Only for the targetted user
	res.json('todo');
});

router.post('/org/:orgId/leave/:userId', (req, res) => {
	// TODO
	// Only for the targetted user
	res.json('todo');
});

router.post('/org/:orgId/visibility', (req, res) => {
	// TODO
	// Only for site admis and org admins
	res.json('todo');
});

router.post('/org/:orgId/ban/:userId', (req, res) => {
	// TODO
	// Only for site admis and org admins
	res.json('todo');
});
