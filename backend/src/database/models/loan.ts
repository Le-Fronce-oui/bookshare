
interface DatabaseLoan {
    id: string,
    organisation_id: string,
    book_id: string,
    owner_id: string,
    borrower_id: string,
    created_at: Date,
    accepted_at: Date | null,
    declined_at: Date | null,
    borrowed_at: Date | null,
    returned_at: Date | null
}

export default DatabaseLoan;