/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `AuthProvider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `AuthProvider` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `provider` on the `AuthProvider` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('local', 'google', 'github');

-- AlterTable
ALTER TABLE "public"."AuthProvider" DROP COLUMN "provider",
ADD COLUMN     "provider" "public"."Provider" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_providerId_key" ON "public"."AuthProvider"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_userId_key" ON "public"."AuthProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_provider_providerId_key" ON "public"."AuthProvider"("provider", "providerId");
