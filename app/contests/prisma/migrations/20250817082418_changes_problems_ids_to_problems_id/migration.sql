/*
  Warnings:

  - You are about to drop the column `problemsIds` on the `Contests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Contests" DROP COLUMN "problemsIds",
ADD COLUMN     "problemsId" TEXT[];
