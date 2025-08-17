/*
  Warnings:

  - You are about to drop the column `problemId` on the `Submissions` table. All the data in the column will be lost.
  - Added the required column `problemsId` to the `Submissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Submissions" DROP CONSTRAINT "Submissions_problemId_fkey";

-- AlterTable
ALTER TABLE "public"."Submissions" DROP COLUMN "problemId",
ADD COLUMN     "problemsId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_problemsId_fkey" FOREIGN KEY ("problemsId") REFERENCES "public"."Problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
