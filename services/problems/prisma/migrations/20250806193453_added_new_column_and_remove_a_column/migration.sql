/*
  Warnings:

  - You are about to drop the column `isSolved` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "isSolved",
ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT false;
