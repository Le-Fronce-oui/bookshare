import { Role } from "../enums";

export interface MemberDTO {
	id: string,
	username: string,
	admin: boolean,
	banned: boolean,
	org_role: Role
}

export interface OrganisationMembersDTO {
	owner: string,
	members: MemberDTO[]
}

export default OrganisationMembersDTO;