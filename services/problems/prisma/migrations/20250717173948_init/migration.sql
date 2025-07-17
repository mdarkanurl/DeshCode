/*
  Warnings:

  - Added the required column `problemTypes` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProblemTypes" AS ENUM ('Arrays_and_Strings', 'Linked_Lists', 'Trees_and_Graphs', 'Dynamic_Programming', 'Sorting_and_Searching');

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "problemTypes" "ProblemTypes" NOT NULL;
