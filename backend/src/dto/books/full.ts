
interface BookDTO {
	id: string,
	name: string,
    desc: string | null,
    type: string,
    iban: string | null,
    author: string,
    cover: string | null
}

export default BookDTO;