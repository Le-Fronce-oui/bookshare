import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run() {
    const user = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: {
            id: 1,
            email: "user@example.com",
            username: "Jason",
            password: "password",
            salt: "salt",
        },
    });

    console.log({ user });
}

run()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });