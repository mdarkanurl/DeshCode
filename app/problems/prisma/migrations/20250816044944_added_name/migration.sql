/*
  Warnings:

  - You are about to drop the column `problemTypes` on the `Problems` table. All the data in the column will be lost.
  - Added the required column `problemsTypes` to the `Problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Problems" DROP COLUMN "problemTypes",
ADD COLUMN     "problemsTypes" "public"."ProblemsTypes" NOT NULL;
