
interface DatabaseLoan {
    id: string,
    organisationId: string,
    bookId: string,
    ownerId: string | null,
    borrowerId: string | null,
    createdAt: Date,
    acceptedAt: Date | null,
    declinedAt: Date | null,
    borrowedAt: Date | null,
    returnedAt: Date | null
}

export default DatabaseLoan;