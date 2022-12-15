import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function run() {
    const uuids = [uuidv4()];


    const orgatest = await prisma.organisations.upsert({
        where: { id: "4" },
        update: {},
        create: {
            id: "4",
            name: "Test",
            ownerId: "ef470bab-38ce-4f77-8331-3da919a98be2",
            desc: "Test",
            visibility: "PUBLIC",
            blocked: false,

        }
    })
    const test = await prisma.loans.upsert({
        where: { id: uuids[0] },
        update: {},
        create: {
            id: uuids[0],
            bookId: "1",
            borrowerId: "f0be19f2-c65e-4458-94f2-091f7f94277c",
            ownerId: "ef470bab-38ce-4f77-8331-3da919a98be2",
            
            orgaId: "4",
            createdAt: new Date(),
            acceptedAt: null,
            borrowedAt: null,
            returnedAt: null,
            declinedAt: null,
        }
    })
    console.log({ test })
}

run()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    }
    )


