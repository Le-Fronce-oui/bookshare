import router from "../../core/router";
import { pool } from "../../database/connect";

router.get('/org/:orgId/info', (req, res) => {
	req.params.orgId;
	pool.query('SELECT * FROM organisations WHERE id = $1', [req.params.orgId], (err, result) => {
		if(err) {
			res.sendStatus(500);
			return;
		}
		if(result.rowCount == 0) {
			res.sendStatus(404);
			return;
		}
		res.json(result.rows);
	});
	res.json('todo');

	
});

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
