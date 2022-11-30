import router from "../../core/router";
import { getUsers } from "../../database/queries/users";

router.get('/users', getUsers);