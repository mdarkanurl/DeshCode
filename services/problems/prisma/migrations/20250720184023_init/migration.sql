/*
  Warnings:

  - You are about to drop the column `isSolved` on the `Problem` table. All the data in the column will be lost.
  - Changed the type of `testCases` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "isSolved",
DROP COLUMN "testCases",
ADD COLUMN     "testCases" JSONB NOT NULL;
