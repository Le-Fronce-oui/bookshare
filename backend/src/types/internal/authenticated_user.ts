import Role from "src/database/models/role";
import Visibility from "src/database/models/visibility";

interface AuthenticatedUser {
	uuid: string,
	username: string,
	role: Role,
	visibility: Visibility
}

export default AuthenticatedUser;
