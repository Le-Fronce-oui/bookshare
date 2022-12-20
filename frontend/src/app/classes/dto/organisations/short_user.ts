import { Role } from "../enums";

interface ShortUserOrganisationDTO {
	id: string,
	name: string,
	role: Role,
	owned: boolean
}

export default ShortUserOrganisationDTO;
