/*
  Warnings:

  - You are about to drop the `Profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Profiles" DROP CONSTRAINT "Profiles_userId_fkey";

-- DropTable
DROP TABLE "public"."Profiles";

-- CreateTable
CREATE TABLE "public"."Google_OAuth" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Google_OAuth_pkey" PRIMARY KEY ("id")
);
