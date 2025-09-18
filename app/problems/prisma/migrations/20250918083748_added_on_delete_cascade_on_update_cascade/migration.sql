-- DropForeignKey
ALTER TABLE "public"."Discussion" DROP CONSTRAINT "Discussion_problemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submissions" DROP CONSTRAINT "Submissions_problemsId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_problemsId_fkey" FOREIGN KEY ("problemsId") REFERENCES "public"."Problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Discussion" ADD CONSTRAINT "Discussion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
