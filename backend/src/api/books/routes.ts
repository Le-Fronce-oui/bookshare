import { getBookById, getBookCover, getBooks } from "../../database/queries/books";
import BookDTO from "../../dto/books/full";
import ShortBookDTO from "../../dto/books/short";
import router from "../../core/router";


router.get('/books/short', (_req, res) => {
	getBooks(books => {
		let data: ShortBookDTO[] = books.map(b => ({
			id: b.id,
			name: b.name,
			cover: b.cover
		}));
		res.json(data);
	}, _ => res.sendStatus(500));
});


router.get('/book/:bookId', (req, res) => {
	getBookById(req.params.bookId, book => {
		if(book !== null) {
			res.json(book as BookDTO);
		} else {
			res.sendStatus(404);
		}
	}, _ => res.sendStatus(500));
});


router.get('/book/cover/:cover', (req, res) => {
	const name = req.params.cover;
	getBookCover(name, cover => {
		if(cover !== null) {
			res.type(name.slice(name.lastIndexOf('.')));
			res.send(cover);
		} else {
			res.sendStatus(404);
		}
	}, _ => res.sendStatus(500));
});
