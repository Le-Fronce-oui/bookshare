import BookDTO from "../books/short";

interface SuperShortUserDTO {
    id: string,
    username: string
}

interface FullLoanDTO {
    id: string,
    owner: SuperShortUserDTO,
    borrower: SuperShortUserDTO,
    book: BookDTO,
    created: Date,
    accepted: Date | null,
    declined: Date | null,
    borrowed: Date | null,
    returned: Date | null,
}

export default FullLoanDTO;
