import app from "./core/api";
import "./api/routes";
const db = require('./utils/queries');

app.listen(8080, () => {
	console.log('Server started');
})

app.get('/users', db.getUsers);


app.use('/auth', require('./api/auth/routes'));