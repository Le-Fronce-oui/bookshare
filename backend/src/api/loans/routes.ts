import { getLoanById, setLoanToAccepted, setLoanToReturned, setLoanToBorrowed, setLoanToDeclined, createLoan } from "../../database/queries/loans";
import { getUserById } from "../../database/queries/users";
import { getBookById } from "../../database/queries/books";
import { FullLoanDTO } from "../../dto/loans/fullLoanDTO";
import router from "../../core/router";
import { authenticated } from "../auth/middlewares";


router.put('/organisation/:org_id/request/:book_id/from/:owner_id', authenticated(401), (req, res) => {
	const org_id = req.params.org_id;
	const book_id = req.params.book_id;
	const owner_id = req.params.owner_id;
	const borrower_id = req.user?.uuid as string;
	if(owner_id === borrower_id) {
		res.sendStatus(400);
		return;
	}
	createLoan(book_id, org_id, owner_id, borrower_id, ok => {
		res.sendStatus(ok ? 200 : 400);
	}, _ => res.sendStatus(500));
});


router.get('/loan/:loanId', authenticated(401), (req, res) => {
	let loanId = req.params.loanId
	getLoanById(loanId, req.user?.uuid as string, loan => {
		if (loan == null) {
			res.sendStatus(404);
			return;
		}
		getUserById(loan.ownerId, owner => {
			if (owner === null) {
				res.sendStatus(500);
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
							acceptedAt: loan.acceptedAt,
							borrowedAt: loan.borrowedAt,
							returnedAt: loan.returnedAt,
							createdAt: loan.createdAt,
							declinedAt: loan.declinedAt,
						}
						res.json(body);
					});
				});
			});
		});
	});
});


router.post('/loan/:loanId/accept', authenticated(401), (req, res) => {
	getLoanById(req.params.loanId, req.user?.uuid as string, loan => {
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
	getLoanById(req.params.loanId, req.user?.uuid as string, loan => {
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
	getLoanById(req.params.loanId, req.user?.uuid as string, loan => {
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
	getLoanById(req.params.loanId, req.user?.uuid as string, loan => {
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
