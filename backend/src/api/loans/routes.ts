import router from "../../core/router";


router.put('/loan/', (req, res) => {
	// TODO target user, organisation, book id
	// User has to be logged in, in the organisation
	// Target user has to belong to the organisation as well
	// and must have at least one available print for this book
	// Return a loan id
	res.json('todo');
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
