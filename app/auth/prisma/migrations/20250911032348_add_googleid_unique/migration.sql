/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Google_OAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Google_OAuth_googleId_key" ON "public"."Google_OAuth"("googleId");
