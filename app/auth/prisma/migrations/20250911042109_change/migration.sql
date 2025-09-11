/*
  Warnings:

  - You are about to drop the `Google_OAuth` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "provider" TEXT;

-- DropTable
DROP TABLE "public"."Google_OAuth";
