import { Role } from "src/app/classes/dto/enums";

export interface Member {
	id: string,
	username: string,
	admin: boolean,
	banned: boolean,
	org_role: Role,
	is_owner: boolean
}
