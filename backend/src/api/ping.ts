import app from "../core/api";

app.get('/api/ping', (req, res) => {
	res.contentType('text/plain').send('pong');
});