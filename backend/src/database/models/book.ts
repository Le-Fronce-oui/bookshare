
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

export interface DatabaseBookInOrg extends DatabaseBook {
    count: number
}

export interface DatabaseUserBooksInOrg {
    user_id: string,
    username: string,
    owned: number,
    lent: number
}

export default DatabaseBook;