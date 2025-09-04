/*
  Warnings:

  - Added the required column `contestsId` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."submissions" ADD COLUMN     "contestsId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_contestsId_fkey" FOREIGN KEY ("contestsId") REFERENCES "public"."contests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
