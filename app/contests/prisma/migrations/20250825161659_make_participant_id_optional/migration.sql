-- DropForeignKey
ALTER TABLE "public"."Submissions" DROP CONSTRAINT "Submissions_participantId_fkey";

-- AlterTable
ALTER TABLE "public"."Submissions" ALTER COLUMN "participantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
