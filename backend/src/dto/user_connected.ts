
interface UserOrganisationDTO {
	id: string,
	role: string,
	owned: boolean
}

interface UserConnectedDTO {
	id: string,
	username: string,
	role: string,
	organisations: UserOrganisationDTO[]
}

export default UserConnectedDTO;