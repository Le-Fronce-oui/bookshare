import router from "../../core/router";


router.get('/user/:userId/info', (req, res) => {
	// TODO
	// Creation date ?
	res.json('todo');
});

router.get('/user/:userId/organisations', (req, res) => {
	// TODO
	res.json('todo');
});

router.get('/user/:userId/loans', (req, res) => {
	// TODO
	res.json('todo');
});

router.get('/user/:userId/prints', (req, res) => {
	// TODO
	res.json('todo');
});

router.put('/user/:userId/print', (req, res) => {
	// TODO
	// Only for the user themselves
	//let dto: BookDTO = req.body;
	res.json('todo');
});

router.delete('/user/:userId/print/:bookId', (req, res) => {
	// TODO
	// Only for the user themselves
	res.json('todo');
});

router.post('/user/:userId/print/:bookId/nb', (req, res) => {
	// TODO
	// Only for the user themselves
	let count = req.query.count;
	let shown = req.query.shown;
	res.json('todo');
});

router.post('/user/:userId/visibility', (req, res) => {
	// TODO
	// Only for the user themselves
	res.json('todo');
});

router.delete('/user/:userId', (req, res) => {
	// TODO delete entry from the database (+ associated loans, prints, memberships, ...)
	// Only for the user themselves
	res.json('todo');
});

router.post('/user/:userId/ban', (req, res) => {
	// TODO
	// (no need to delete from database, just set the ban field)
	// Only for site admins
	res.json('todo');
});

