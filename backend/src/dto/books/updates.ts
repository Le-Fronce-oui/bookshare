
export interface BookUpdateCountDTO {
	book_id: string,
	count: number,
	shown: number
}

interface BookUpdatesDTO {
	delete: string[],
	edit: BookUpdateCountDTO[]
}

export default BookUpdatesDTO;