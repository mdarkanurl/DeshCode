/*
  Warnings:

  - You are about to drop the `Disscuss` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_discussId_fkey";

-- DropTable
DROP TABLE "Disscuss";

-- CreateTable
CREATE TABLE "Discuss" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" "Topic" NOT NULL DEFAULT 'Career',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discuss_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Discuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
