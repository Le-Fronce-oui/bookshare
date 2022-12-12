import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function run() {
    const uuids = [uuidv4()];
    const hobbit = await prisma.books.upsert({
        where: { id: uuids[0] },
        update: {},
        create: {

            id: uuids[0],
            name: 'The Hobbit',
            desc: 'A book about a hobbit',
            type: 'BOOK',
            iban: '1234567890',
            author: 'J.R.R. Tolkien',
            cover: 'hobbit.jpg',
        },
    })
    console.log({ hobbit })
}
run()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    }
    )

