/*
  Warnings:

  - You are about to drop the `Contest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Participant" DROP CONSTRAINT "Participant_contestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submissions" DROP CONSTRAINT "Submissions_participantId_fkey";

-- DropTable
DROP TABLE "public"."Contest";

-- DropTable
DROP TABLE "public"."Participant";

-- CreateTable
CREATE TABLE "public"."Contests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules" TEXT,
    "problemsIds" TEXT[],
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contests_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participants" ADD CONSTRAINT "Participants_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "public"."Contests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
