
interface BookDTO {
	id: string,
	name: string,
    desc?: string,
    type: string,
    iban?: string,
    author: string,
    cover?: string
}

export default BookDTO;