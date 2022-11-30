import app from "./core/api";
import "./api/routes";

app.listen(8080, () => {
	console.log('Server started');
})
