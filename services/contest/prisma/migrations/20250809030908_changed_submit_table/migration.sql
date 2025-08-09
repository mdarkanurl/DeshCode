/*
  Warnings:

  - You are about to drop the column `submitId` on the `SubmitData` table. All the data in the column will be lost.
  - You are about to drop the column `submitStatus` on the `SubmitData` table. All the data in the column will be lost.
  - Added the required column `code` to the `SubmitData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `SubmitData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemId` to the `SubmitData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SubmitData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SubmitData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmitData" DROP COLUMN "submitId",
DROP COLUMN "submitStatus",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "memoryKb" INTEGER,
ADD COLUMN     "output" TEXT,
ADD COLUMN     "problemId" TEXT NOT NULL,
ADD COLUMN     "runtimeMs" INTEGER,
ADD COLUMN     "status" "SubmitStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
