/*
  Warnings:

  - You are about to drop the column `googleId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Users" DROP COLUMN "googleId",
DROP COLUMN "provider";

-- CreateTable
CREATE TABLE "public"."Google_OAuth" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Google_OAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Google_OAuth_googleId_key" ON "public"."Google_OAuth"("googleId");
