/*
  Warnings:

  - Added the required column `verificationCode` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "verificationCode" INTEGER NOT NULL;
