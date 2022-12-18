import { Role } from "../enums";
import ShortUserOrganisationDTO from "../organisations/short_user";
import ShortUserBookDTO from "../books/short_user";

export interface UserBookGenericDTO<T> {
	id: string,
	username: string,
	role: Role,
	organisations: ShortUserOrganisationDTO[],
	books: T[]
}

interface UserDTO extends UserBookGenericDTO<ShortUserBookDTO> { }

export default UserDTO;