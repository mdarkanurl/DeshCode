/*
  Warnings:

  - You are about to drop the column `discussId` on the `Comments` table. All the data in the column will be lost.
  - You are about to drop the `Discuss` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `discussionsId` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_discussId_fkey";

-- AlterTable
ALTER TABLE "public"."Comments" DROP COLUMN "discussId",
ADD COLUMN     "discussionsId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Discuss";

-- CreateTable
CREATE TABLE "public"."Discussions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" "public"."Topic" NOT NULL DEFAULT 'Career',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discussions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_discussionsId_fkey" FOREIGN KEY ("discussionsId") REFERENCES "public"."Discussions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
