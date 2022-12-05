import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const user1 = await prisma.user.upsert({
        where: { email: 'alice@prisma.io' },
        update: {},
        create: {
            email: 'alice@prisma.io',
            username: 'Alice',
            password: 'password',
            salt: 'salt',
            role: 'USER',
            visibility : 'PUBLIC',
        },
    })
   
    const admin = await prisma.user.upsert({
        where: { email: 'admin@prisma.io' },
        update: {},
        create: {
            email: 'admin@prisma.io',
            username: 'admin',
            password: 'admin',
            salt: 'salt',
            role: 'ADMIN',
            visibility : 'PRIVATE',
        },
    })

    const 
    console.log({ user1, admin })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })