import Role from "./role";
import Visibility from "./visibility";

interface DatabaseUser {
	id: string,
    email: string,
    username: string,
    password: string,
    salt: string,
    visibility: Visibility,
    role: Role,
    banned: boolean
}

export default DatabaseUser;