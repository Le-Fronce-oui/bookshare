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
    createdAt: Date,
    acceptedAt: Date | null,
    declinedAt: Date | null,
    borrowedAt: Date | null,
    returnedAt: Date | null,
}

export { FullLoanDTO, SuperShortUserDTO }