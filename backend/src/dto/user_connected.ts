import { Role } from "./enums";

interface UserOrganisationDTO {
	id: string,
	role: Role,
	owned: boolean
}

interface UserConnectedDTO {
	id: string,
	username: string,
	role: Role,
	organisations: UserOrganisationDTO[]
}

export default UserConnectedDTO;