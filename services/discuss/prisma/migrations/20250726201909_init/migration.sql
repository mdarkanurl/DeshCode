-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('Career', 'Compensation', 'Feedback', 'Interview');

-- CreateTable
CREATE TABLE "Disscuss" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" "Topic" NOT NULL DEFAULT 'Career',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disscuss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "discussId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_discussId_fkey" FOREIGN KEY ("discussId") REFERENCES "Disscuss"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
