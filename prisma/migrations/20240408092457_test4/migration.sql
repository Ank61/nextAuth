/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Boards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Boards_title_key" ON "Boards"("title");
