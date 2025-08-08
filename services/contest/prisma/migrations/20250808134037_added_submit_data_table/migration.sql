-- CreateEnum
CREATE TYPE "SubmitStatus" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'EXECUTION_ERROR', 'TIME_OUT', 'FAILED', 'INTERNAL_ERROR', 'INVALID_FUNCTION_SIGNATURE', 'LANGUAGE_NOT_SUPPORTED');

-- CreateTable
CREATE TABLE "SubmitData" (
    "id" SERIAL NOT NULL,
    "contestId" TEXT NOT NULL,
    "submitId" INTEGER NOT NULL,
    "submitStatus" "SubmitStatus" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SubmitData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmitData" ADD CONSTRAINT "SubmitData_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
