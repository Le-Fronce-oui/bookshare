
export interface DatabaseBook {
	id: string,
	name: string,
    desc: string | null,
    type: string,
    iban: string | null,
    author: string,
    cover: string | null
}

export interface UserDatabaseBook extends DatabaseBook {
    num_owned: number,
    num_lent:  number,
    num_shown: number
}

export default DatabaseBook;