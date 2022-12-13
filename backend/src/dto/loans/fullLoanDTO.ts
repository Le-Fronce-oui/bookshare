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
    created_at: Date,
    accepted_at: Date | null,
    declined_at: Date | null,
    borrowed_at: Date | null,
    returned_at: Date | null,
}

export { FullLoanDTO, SuperShortUserDTO }