import { Role } from "./enums";
import ShortOrganisationDTO from "./organisations/short";

interface UserConnectedDTO {
	id: string,
	username: string,
	role: Role,
	organisations: ShortOrganisationDTO[]
}

export default UserConnectedDTO;