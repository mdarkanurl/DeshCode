/*
  Warnings:

  - You are about to drop the column `username` on the `Google_OAuth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Google_OAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Google_OAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isVerified` to the `Google_OAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Google_OAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Google_OAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Google_OAuth" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Google_OAuth_email_key" ON "public"."Google_OAuth"("email");
