/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Users" (
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "Boards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workspace" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Boards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Boards" ADD CONSTRAINT "Boards_email_fkey" FOREIGN KEY ("email") REFERENCES "Users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
