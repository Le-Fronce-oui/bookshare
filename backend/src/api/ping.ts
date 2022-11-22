import router from "../core/router";


router.get('/ping', (_req, res) => {
	res.type('text/plain');
	res.send('pong');
});
