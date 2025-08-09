/*
  Warnings:

  - You are about to drop the `SubmitData` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProblemTypes" AS ENUM ('NORMAL_PROBLEM', 'Arrays_and_Strings', 'Linked_Lists', 'Trees_and_Graphs', 'Dynamic_Programming', 'Sorting_and_Searching');

-- DropForeignKey
ALTER TABLE "SubmitData" DROP CONSTRAINT "SubmitData_contestId_fkey";

-- DropTable
DROP TABLE "SubmitData";

-- CreateTable
CREATE TABLE "Submit" (
    "id" SERIAL NOT NULL,
    "participantId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
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

-- AddForeignKey
ALTER TABLE "Submit" ADD CONSTRAINT "Submit_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
