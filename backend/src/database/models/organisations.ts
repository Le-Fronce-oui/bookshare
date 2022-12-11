import Role from "./role"

export interface DatabaseOrganisation {
    id: string,
    name: string,
    ownerId: string,
    desc: string | null,
    blocked: boolean,
    visibility: string,
}

export interface UserDatabaseOrganisation extends DatabaseOrganisation {
    role: Role,
    banned: boolean
}

export default DatabaseOrganisation