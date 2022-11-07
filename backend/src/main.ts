import app from "./core/api";
import "./api/ping";

app.listen(8080, () => {
	console.log('Server started');
})