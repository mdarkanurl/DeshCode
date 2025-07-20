/*
  Warnings:

  - You are about to drop the column `functionName` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `problemTypes` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `testCases` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `memoryKb` on the `Submit` table. All the data in the column will be lost.
  - You are about to drop the column `runtimeMs` on the `Submit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Submit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('python', 'javascript', 'typescript', 'cpp', 'java', 'c', 'go', 'ruby', 'swift');

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "functionName",
DROP COLUMN "problemTypes",
DROP COLUMN "tags",
DROP COLUMN "testCases",
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "language" SET NOT NULL,
ALTER COLUMN "language" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Submit" DROP COLUMN "memoryKb",
DROP COLUMN "runtimeMs",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "TestCase" (
    "id" SERIAL NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "expected" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
