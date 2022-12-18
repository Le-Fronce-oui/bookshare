import UserDTO from "./users/full";

interface UserConnectedDTO extends UserDTO {
	loans: string[]
}

export default UserConnectedDTO;