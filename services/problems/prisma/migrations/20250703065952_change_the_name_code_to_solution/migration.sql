/*
  Warnings:

  - You are about to drop the column `code` on the `Submit` table. All the data in the column will be lost.
  - Added the required column `solution` to the `Submit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submit" DROP COLUMN "code",
ADD COLUMN     "solution" TEXT NOT NULL;
