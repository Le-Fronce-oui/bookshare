import express from 'express';
import router from "./router";
import cookieParser from "cookie-parser";
// import { auth } from "../api/auth/middlewares";

const app = express();
app.use(cookieParser());
//app.use(auth);
app.use('/api', router);

export default app;
