import router from "../../core/router";


router.get('/user/:userId/info', (req, res) => {
	// TODO
	res.json('todo');
});

router.get('/user/:userId/prints', (req, res) => {
	// TODO
	res.json('todo');
});

router.post('/user/:userId/print', (req, res) => {
	// TODO
	let dto: BookDTO = req.body;
	res.json('todo');
});

