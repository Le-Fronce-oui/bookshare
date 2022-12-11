import { Role } from "../enums";
import ShortOrganisationDTO from "../organisations/short";
import ShortUserBookDTO from "../books/short_user";

interface UserDTO {
	id: string,
	username: string,
	role: Role,
	organisations: ShortOrganisationDTO[],
	books: ShortUserBookDTO[]
}

export default UserDTO;