import { getLoanById } from "src/database/queries/loans";
import { getUserById } from "src/database/queries/users";
import FullLoanDTO from "src/dto/loans/fullLoanDTO";
import router from "../../core/router";
import { authenticated } from "../auth/middlewares";


router.put('/loan/', (req, res) => {
	// TODO target user, organisation, book id
	// User has to be logged in, in the organisation
	// Target user has to belong to the organisation as well
	// and must have at least one available print for this book
	// Return a loan id
	res.json('todo');
});

router.get('/loan/:loanId', authenticated(401), (req, res) => {
	let loandId = req.params.loanId

	getLoanById(loandId, loan => {
		if (loan == null) {
			res.sendStatus(404);
			return;
		}
		if (loan.borrower_id !== req.user?.uuid) {
			res.sendStatus(404);
			return;
		} else {
			let ownerId = loan.owner_id;
			let borrowerId = loan.borrower_id;
			getUserById(loan.owner_id, owner => {
				if (owner == null) {
			let body: FullLoanDTO = {
				id: loan.id,
				owner: { 
					id: loan.owner_id,
					username: loan.owner_username,
				},
				borrower: {
					id: loan.borrower_id,
					username: loan.borrower_username,
				},
				book: {
					id: loan.book_id,
					name: loan.book_name,
					cover: loan.book_cover || null,

				},
				created: loan.created_at,
				accepted: loan.accepted_at,
				declined: loan.declined_at,
				borrowed: loan.borrowed_at,
				returned: loan.returned_at,

			}
		});

	router.post('/loan/:loanId/accept', (req, res) => {
		// TODO
		// Only for the owner of the book
		// If not already denied
		res.json('todo');
	});

	router.post('/loan/:loanId/deny', (req, res) => {
		// TODO
		// Only for the owner of the book
		// If not already accepted
		res.json('todo');
	});

	router.post('/loan/:loanId/borrow', (req, res) => {
		// TODO
		// Only for the borrower
		// Has to be accepted
		res.json('todo');
	});

	router.post('/loan/:loanId/returned', (req, res) => {
		// TODO
		// Only for the owner of the book
		// Has to be borrowed
		res.json('todo');
	});
