/*
  Warnings:

  - The values [Failed] on the enum `SubmitStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmitStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'EXECUTION_ERROR', 'TIME_OUT', 'FAILED', 'INTERNAL_ERROR', 'INVALID_FUNCTION_SIGNATURE', 'LANGUAGE_NOT_SUPPORTED');
ALTER TABLE "Submit" ALTER COLUMN "status" TYPE "SubmitStatus_new" USING ("status"::text::"SubmitStatus_new");
ALTER TYPE "SubmitStatus" RENAME TO "SubmitStatus_old";
ALTER TYPE "SubmitStatus_new" RENAME TO "SubmitStatus";
DROP TYPE "SubmitStatus_old";
COMMIT;
