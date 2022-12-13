import { getLoanById, setLoanToAccepted, setLoanToReturned, setLoanToBorrowed, setLoanToDeclined } from "../../database/queries/loans";
import { getUserById } from "../../database/queries/users";
import { getBookById } from "../../database/queries/books";
import { SuperShortUserDTO, FullLoanDTO } from "../../dto/loans/fullLoanDTO";
import router from "../../core/router";
import { authenticated } from "../auth/middlewares";
import ShortBookDTO from "src/dto/books/short";


router.put('/loan/', (req, res) => {
	// TODO target user, organisation, book id
	// User has to be logged in, in the organisation
	// Target user has to belong to the organisation as well
	// and must have at least one available print for this book
	// Return a loan id
	res.json('todo');
});

router.get('/loan/:loanId', authenticated(401), (req, res) => {
	let loan_id = req.params.loanId
	getLoanById(loan_id, loan => {
		if (loan == null) {
			res.sendStatus(404);
			return;
		}
		if (loan.borrower_id !== req.user?.uuid || loan.owner_id !== req.user?.uuid) {
			res.sendStatus(404);
			return;
		} else {
			let loan_owner: SuperShortUserDTO | undefined
			getUserById(loan.owner_id, owner => {
				if (owner != null) {
					loan_owner = {
						id: owner.id,
						username: owner.username
					}
				}
			});
			let loan_borrower: SuperShortUserDTO | undefined
			getUserById(loan.borrower_id, borrower => {
				if (borrower != null) {
					loan_borrower = {
						id: borrower.id,
						username: borrower.username
					}
				}
			});
			let loan_book: ShortBookDTO | undefined
			getBookById(loan.book_id, book => {
				if (book != null) {
					loan_book = {
						id: book.id,
						name: book.name,
						cover: null,
					}
				}
			});
			let body: FullLoanDTO = {
				id: loan.id,
				owner: loan_owner,
				borrower: loan_borrower,
				book: loan_book,
				accepted_at: loan.accepted_at,
				borrowed_at: loan.borrowed_at,
				returned_at: loan.returned_at,
				created_at: loan.created_at,
				declined_at: loan.declined_at,
			}
			res.json(body);
		}
	});
});



router.post('/loan/:loanId/accept', authenticated(401), (req, res) => {
	// TODO
	// Only for the owner of the book
	// If not already denied

	getLoanById(req.params.loanId, loan => {
		if (loan == null) {
			res.sendStatus(404);
			return;
		}
		if (loan.owner_id !== req.user?.uuid || loan.borrower_id !== req.user?.uuid) {
			res.sendStatus(404);
			return;
		} if (loan.borrower_id === req.user?.uuid) {
			res.sendStatus(403);
			return;
		} if (loan.accepted_at !== null || loan.declined_at !== null) {
			res.sendStatus(400);
			return;
		} else if (loan.owner_id === req.user?.uuid) {
			setLoanToAccepted(req.params.loanId, new Date(), () => {
				res.sendStatus(200);
			});
		}
	});
});
router.post('/loan/:loanId/deny', authenticated(401), (req, res) => {
	// TODO
	// Only for the owner of the book
	// If not already accepted

	getLoanById(req.params.loanId, loan => {
		if (loan == null) {
			res.sendStatus(404);
			return;
		}
		if (loan.owner_id !== req.user?.uuid || loan.borrower_id !== req.user?.uuid) {
			res.sendStatus(404);
			return;
		} if (loan.borrower_id === req.user?.uuid) {
			res.sendStatus(403);
			return;
		} if (loan.accepted_at !== null || loan.declined_at !== null) {
			res.sendStatus(400);
			return;
		} else if (loan.owner_id === req.user?.uuid) {
			setLoanToDeclined(req.params.loanId, new Date(), () => {
				res.sendStatus(200);
			});
		}
	});
});

router.post('/loan/:loanId/borrow', authenticated(401), (req, res) => {
	// TODO
	// Only for the borrower
	// Has to be accepted
	getLoanById(req.params.loanId, loan => {
		if (loan == null) {
			res.sendStatus(404);
			return;
		}
		if (loan.owner_id !== req.user?.uuid || loan.borrower_id !== req.user?.uuid) {
			res.sendStatus(404);
			return;
		} if (loan.borrower_id === req.user?.uuid) {
			res.sendStatus(403);
			return;
		} if (loan.borrowed_at !== null || loan.accepted_at === null || loan.declined_at !== null) {
			res.sendStatus(400);
			return;
		} else if (loan.owner_id === req.user?.uuid) {
			setLoanToBorrowed(req.params.loanId, new Date(), () => {
				res.sendStatus(200);
			});
		}
	});
});

router.post('/loan/:loanId/returned', authenticated(401), (req, res) => {
	// TODO
	// Only for the owner of the book
	// Has to be borrowed

	getLoanById(req.params.loanId, loan => {
		if (loan == null) {
			res.sendStatus(404);
			return;
		}
		if (loan.owner_id !== req.user?.uuid || loan.borrower_id !== req.user?.uuid) {
			res.sendStatus(404);
			return;
		} if (loan.borrower_id === req.user?.uuid) {
			res.sendStatus(403);
			return;
		} if (loan.borrowed_at === null) {
			res.sendStatus(400);
			return;
		} else if (loan.owner_id === req.user?.uuid) {
			setLoanToReturned(req.params.loanId, new Date(), () => { })
			res.sendStatus(200);
		}
	});
});
