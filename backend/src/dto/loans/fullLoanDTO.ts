import ShortBookDTO from "../books/short";

interface SuperShortUserDTO {
    id: string,
    username: string
}

interface FullLoanDTO {
    id: string,
    owner: SuperShortUserDTO | null,
    borrower: SuperShortUserDTO | null,
    book: ShortBookDTO,
    createdAt: number,
    acceptedAt: number | null,
    declinedAt: number | null,
    borrowedAt: number | null,
    returnedAt: number | null,
}

export { FullLoanDTO, SuperShortUserDTO }