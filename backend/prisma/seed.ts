import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function run() {
    const hobbit = await prisma.books.upsert({
        where: { id: '1' },
        update: {},
        create: {

            id: '1',
            name: 'The Hobbit',
            desc: 'A book about a hobbit',
            type: 'BOOK',
            iban: '1234567890',
            author: 'J.R.R. Tolkien',
            cover: 'https://m.media-amazon.com/images/I/413V3sIKSJL._AC_SY780_.jpg',
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

