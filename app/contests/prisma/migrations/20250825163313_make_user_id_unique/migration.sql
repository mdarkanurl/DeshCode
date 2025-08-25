/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Participants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Participants_userId_key" ON "public"."Participants"("userId");
