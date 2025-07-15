/*
  Warnings:

  - You are about to drop the column `solution` on the `Submit` table. All the data in the column will be lost.
  - Added the required column `code` to the `Submit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmitStatus" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'EXECUTION_ERROR', 'TIME_OUT');

-- AlterTable
ALTER TABLE "Submit" DROP COLUMN "solution",
ADD COLUMN     "code" TEXT NOT NULL;
