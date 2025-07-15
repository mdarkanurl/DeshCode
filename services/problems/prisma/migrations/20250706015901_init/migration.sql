/*
  Warnings:

  - Changed the type of `language` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `language` on the `Submit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('JavaScript', 'Python', 'Go', 'Rust', 'C', 'C_Plus_Plus', 'C_Sharp', 'Java', 'SQL', 'Swift');

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL;

-- AlterTable
ALTER TABLE "Submit" DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL;
