-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "SubmitStatus" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'EXECUTION_ERROR', 'TIME_OUT', 'FAILED', 'INTERNAL_ERROR', 'INVALID_FUNCTION_SIGNATURE', 'LANGUAGE_NOT_SUPPORTED');

-- CreateEnum
CREATE TYPE "ProblemTypes" AS ENUM ('NORMAL_PROBLEM', 'Arrays_and_Strings', 'Linked_Lists', 'Trees_and_Graphs', 'Dynamic_Programming', 'Sorting_and_Searching');

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "functionName" TEXT NOT NULL,
    "language" TEXT[],
    "difficulty" "DifficultyLevel" NOT NULL,
    "testCases" JSONB[],
    "problemTypes" "ProblemTypes" NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "problemId" TEXT NOT NULL,
    "status" "SubmitStatus" NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "output" TEXT,
    "runtimeMs" INTEGER,
    "memoryKb" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submit" ADD CONSTRAINT "Submit_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
