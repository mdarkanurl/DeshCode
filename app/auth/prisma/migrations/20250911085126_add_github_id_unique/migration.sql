/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `GitHub_OAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GitHub_OAuth_githubId_key" ON "public"."GitHub_OAuth"("githubId");
