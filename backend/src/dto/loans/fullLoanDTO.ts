import ShortBookDTO from "../books/short";

interface SuperShortUserDTO {
    id: string,
    username: string
}

interface FullLoanDTO {
    id: string,
    owner: SuperShortUserDTO | undefined,
    borrower: SuperShortUserDTO | undefined,
    book: ShortBookDTO | undefined,
    created_at: Date,
    accepted_at: Date | null,
    declined_at: Date | null,
    borrowed_at: Date | null,
    returned_at: Date | null,
}

export { FullLoanDTO, SuperShortUserDTO }