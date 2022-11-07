import app from "../core/api";


app.get('/ping', (req, res) => {
	res.send('ping');
});
