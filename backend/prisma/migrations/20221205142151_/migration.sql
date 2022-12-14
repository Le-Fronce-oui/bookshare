/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "role" "Role" NOT NULL DEFAULT 'USER',
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Books" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "type" TEXT NOT NULL,
    "iban" TEXT,
    "author" TEXT NOT NULL,
    "cover" TEXT,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organisations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "desc" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "blocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loans" (
    "id" TEXT NOT NULL,
    "orgaId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "ownerId" TEXT,
    "borrowerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3) DEFAULT NULL,
    "declinedAt" TIMESTAMP(3) DEFAULT NULL,
    "borrowedAt" TIMESTAMP(3) DEFAULT NULL,
    "returnedAt" TIMESTAMP(3) DEFAULT NULL,

    CONSTRAINT "Loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collections" (
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "num_owned" INTEGER NOT NULL,
    "num_lent" INTEGER NOT NULL CHECK (num_lent >= 0),
    "num_shown" INTEGER NOT NULL CHECK (num_shown >= 0),
    CHECK (num_owned >= num_shown),

    CONSTRAINT "Collections_pkey" PRIMARY KEY ("userId", "bookId")
);

-- CreateTable
CREATE TABLE "Members" (
    "userId" TEXT NOT NULL,
    "orgaId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    CHECK (NOT banned OR "role" <> 'ADMIN'),

    CONSTRAINT "Members_pkey" PRIMARY KEY ("userId", "orgaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Books_id_key" ON "Books"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Organisations_id_key" ON "Organisations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Loans_id_key" ON "Loans"("id");

-- AddForeignKey
ALTER TABLE "Organisations" ADD CONSTRAINT "Organisations_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_orgaId_fkey" FOREIGN KEY ("orgaId") REFERENCES "Organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Members" ADD CONSTRAINT "Members_orgaId_fkey" FOREIGN KEY ("orgaId") REFERENCES "Organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
