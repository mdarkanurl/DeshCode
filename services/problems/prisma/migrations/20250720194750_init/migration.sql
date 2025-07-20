/*
  Warnings:

  - You are about to drop the column `slug` on the `Problem` table. All the data in the column will be lost.
  - The `language` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `functionName` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemTypes` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Problem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problemId_fkey";

-- DropIndex
DROP INDEX "Problem_slug_key";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "slug",
ADD COLUMN     "functionName" TEXT NOT NULL,
ADD COLUMN     "isSolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "problemTypes" "ProblemTypes" NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "testCases" JSONB[],
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "language",
ADD COLUMN     "language" TEXT[];

-- AlterTable
ALTER TABLE "Submit" ADD COLUMN     "memoryKb" INTEGER,
ADD COLUMN     "runtimeMs" INTEGER;

-- DropTable
DROP TABLE "TestCase";

-- DropEnum
DROP TYPE "Language";
