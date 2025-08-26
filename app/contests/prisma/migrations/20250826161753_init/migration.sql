-- CreateEnum
CREATE TYPE "public"."SubmissionsStatus" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'EXECUTION_ERROR', 'TIME_OUT', 'FAILED', 'INTERNAL_ERROR', 'INVALID_FUNCTION_SIGNATURE', 'LANGUAGE_NOT_SUPPORTED');

-- CreateEnum
CREATE TYPE "public"."ProblemsTypes" AS ENUM ('NORMAL_PROBLEM', 'Arrays_and_Strings', 'Linked_Lists', 'Trees_and_Graphs', 'Dynamic_Programming', 'Sorting_and_Searching');

-- CreateTable
CREATE TABLE "public"."Contests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules" TEXT,
    "problemsId" TEXT[],
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Submissions" (
    "id" SERIAL NOT NULL,
    "participantId" TEXT,
    "userId" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "public"."Participants" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participants_userId_key" ON "public"."Participants"("userId");

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participants" ADD CONSTRAINT "Participants_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "public"."Contests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
