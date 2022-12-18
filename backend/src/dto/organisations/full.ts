import ShortUserBookDTO from "../books/short_user";

interface OrganisationDTO {
	id: string,
	name: string,
	desc: string | null,
	owner: {
		id: string
		username: string
	} | null;
	books: ShortUserBookDTO[]
}

export default OrganisationDTO;