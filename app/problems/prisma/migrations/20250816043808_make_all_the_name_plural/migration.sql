/*
  Warnings:

  - You are about to drop the `Problem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submit` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."submissionsStatus" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'EXECUTION_ERROR', 'TIME_OUT', 'FAILED', 'INTERNAL_ERROR', 'INVALID_FUNCTION_SIGNATURE', 'LANGUAGE_NOT_SUPPORTED');

-- CreateEnum
CREATE TYPE "public"."ProblemsTypes" AS ENUM ('NORMAL_PROBLEM', 'Arrays_and_Strings', 'Linked_Lists', 'Trees_and_Graphs', 'Dynamic_Programming', 'Sorting_and_Searching');

-- DropForeignKey
ALTER TABLE "public"."Discussion" DROP CONSTRAINT "Discussion_problemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submit" DROP CONSTRAINT "Submit_problemId_fkey";

-- DropTable
DROP TABLE "public"."Problem";

-- DropTable
DROP TABLE "public"."Submit";

-- DropEnum
DROP TYPE "public"."ProblemTypes";

-- DropEnum
DROP TYPE "public"."SubmitStatus";

-- CreateTable
CREATE TABLE "public"."Problems" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "functionName" TEXT NOT NULL,
    "language" TEXT[],
    "difficulty" "public"."DifficultyLevel" NOT NULL,
    "testCases" JSONB[],
    "problemTypes" "public"."ProblemsTypes" NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submissions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "problemId" TEXT NOT NULL,
    "status" "public"."submissionsStatus" NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "output" TEXT,
    "runtimeMs" INTEGER,
    "memoryKb" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Discussion" ADD CONSTRAINT "Discussion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
