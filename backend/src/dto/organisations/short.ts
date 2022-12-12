import { Role } from "../enums";

interface ShortOrganisationDTO {
	id: string,
	name: string,
	role: Role,
	owned: boolean
}

export default ShortOrganisationDTO;
