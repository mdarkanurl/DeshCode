/*
  Warnings:

  - You are about to drop the column `problemIds` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the `Submit` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."SubmissionsStatus" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'EXECUTION_ERROR', 'TIME_OUT', 'FAILED', 'INTERNAL_ERROR', 'INVALID_FUNCTION_SIGNATURE', 'LANGUAGE_NOT_SUPPORTED');

-- DropForeignKey
ALTER TABLE "public"."Submit" DROP CONSTRAINT "Submit_participantId_fkey";

-- AlterTable
ALTER TABLE "public"."Contest" DROP COLUMN "problemIds",
ADD COLUMN     "problemsIds" TEXT[];

-- DropTable
DROP TABLE "public"."Submit";

-- DropEnum
DROP TYPE "public"."ProblemTypes";

-- DropEnum
DROP TYPE "public"."SubmitStatus";

-- CreateTable
CREATE TABLE "public"."Submissions" (
    "id" SERIAL NOT NULL,
    "participantId" TEXT NOT NULL,
    "problemsId" TEXT NOT NULL,
    "status" "public"."SubmissionsStatus" NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "output" TEXT,
    "runtimeMs" INTEGER,
    "memoryKb" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
