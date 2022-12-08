import BookDTO from "../books/short";
import shortUserDTO from "../users/shortuserDTO";



interface FullLoanDTO {
    id: string,
    owner: shortUserDTO,
    borrower: shortUserDTO,
    book: BookDTO,
    created: Date,
    accepted: Date | null,
    declined: Date | null,
    borrowed: Date | null,
    returned: Date | null,
}

export default FullLoanDTO;
