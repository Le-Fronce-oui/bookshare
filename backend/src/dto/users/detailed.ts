import FullUserBookDTO from "../books/full_user";
import { Visibility } from "../enums";
import { UserBookGenericDTO } from "./full";

interface DetailedUserDTO extends UserBookGenericDTO<FullUserBookDTO> {
	visibility: Visibility
}

export default DetailedUserDTO;