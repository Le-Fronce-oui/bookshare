import { getLoanById, setLoanToAccepted, setLoanToReturned, setLoanToBorrowed, setLoanToDeclined } from "../../database/queries/loans";
import { getUserById } from "../../database/queries/users";
import { getBookById } from "../../database/queries/books";
import { SuperShortUserDTO, FullLoanDTO } from "../../dto/loans/fullLoanDTO";
import router from "../../core/router";
import { authenticated } from "../auth/middlewares";
import ShortBookDTO from "src/dto/books/short";
import { v4 as uuidv4 } from 'uuid';

router.put('/api/organisation/:org_id/request/:book_id/from/:user_id', (req, res) => {
	// TODO target user, organisation, book id
	// User has to be logged in, in the organisation
	// Target user has to belong to the organisation as well
	// and must have at least one available print for this book
	// Return a loan id
	res.json('todo');



	putLoaninDB(uuidv4(), req.params.book_id, req.user?.uuid, req.params.user_id, req.params.org_id, loan => {
	});

	router.get('/loan/:loanId', authenticated(401), (req, res) => {
		let loan_id = req.params.loanId
		getLoanById(loan_id, loan => {
			if (loan == null) {
				res.sendStatus(404);
				return;

			}

			getUserById(loan.ownerId, owner => {
				if (owner === null) {
					res.sendStatus(500);
					return;
				}
				let loan_owner = {
					id: owner.id,
					username: owner.username
				}
				getUserById(loan.borrowerId, borrower => {
					if (borrower === null) {
						res.sendStatus(500);
						return;
					}
					let loan_borrower = {
						id: borrower.id,
						username: borrower.username
					}
					getBookById(loan.bookId, book => {
						if (book === null) {
							res.sendStatus(500);
							return;
						}
						let loan_book = {
							id: book.id,
							name: book.name,
							cover: book.cover,
						}
						let body: FullLoanDTO = {
							id: loan.id,
							owner: loan_owner,
							borrower: loan_borrower,
							book: loan_book,
							accepted_at: loan.acceptedAt,
							borrowed_at: loan.borrowedAt,
							returned_at: loan.returnedAt,
							created_at: loan.createdAt,
							declined_at: loan.declinedAt,
						}
						res.json(body);
					});
				});
			});
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
			if (loan.ownerId !== req.user?.uuid || loan.borrowerId !== req.user?.uuid) {
				res.sendStatus(404);
				return;
			} if (loan.borrowerId === req.user?.uuid) {
				res.sendStatus(403);
				return;
			} if (loan.acceptedAt !== null || loan.declinedAt !== null) {
				res.sendStatus(400);
				return;
			} else if (loan.ownerId === req.user?.uuid) {
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
			if (loan.ownerId !== req.user?.uuid || loan.borrowerId !== req.user?.uuid) {
				res.sendStatus(404);
				return;
			} if (loan.borrowerId === req.user?.uuid) {
				res.sendStatus(403);
				return;
			} if (loan.acceptedAt !== null || loan.declinedAt !== null) {
				res.sendStatus(400);
				return;
			} else if (loan.ownerId === req.user?.uuid) {
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
			if (loan.ownerId !== req.user?.uuid || loan.borrowerId !== req.user?.uuid) {
				res.sendStatus(404);
				return;
			} if (loan.borrowerId === req.user?.uuid) {
				res.sendStatus(403);
				return;
			} if (loan.borrowedAt !== null || loan.acceptedAt === null || loan.declinedAt !== null) {
				res.sendStatus(400);
				return;
			} else if (loan.ownerId === req.user?.uuid) {
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
			if (loan.ownerId !== req.user?.uuid || loan.borrowerId !== req.user?.uuid) {
				res.sendStatus(404);
				return;
			} if (loan.borrowerId === req.user?.uuid) {
				res.sendStatus(403);
				return;
			} if (loan.borrowedAt === null) {
				res.sendStatus(400);
				return;
			} else if (loan.ownerId === req.user?.uuid) {
				setLoanToReturned(req.params.loanId, new Date(), () => { })
				res.sendStatus(200);
			}
		});
	});
