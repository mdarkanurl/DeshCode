/*
  Warnings:

  - The `language` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `language` on the `Submit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "language",
ADD COLUMN     "language" TEXT[];

-- AlterTable
ALTER TABLE "Submit" DROP COLUMN "language",
ADD COLUMN     "language" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Language";
