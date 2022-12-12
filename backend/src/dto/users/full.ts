import { Role } from "../enums";
import ShortUserOrganisationDTO from "../organisations/short_user";
import ShortUserBookDTO from "../books/short_user";

interface UserDTO {
	id: string,
	username: string,
	role: Role,
	organisations: ShortUserOrganisationDTO[],
	books: ShortUserBookDTO[]
}

export default UserDTO;