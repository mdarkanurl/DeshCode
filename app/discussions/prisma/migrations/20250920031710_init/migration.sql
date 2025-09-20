-- CreateEnum
CREATE TYPE "public"."Topic" AS ENUM ('Career', 'Compensation', 'Feedback', 'Interview');

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

-- CreateTable
CREATE TABLE "public"."Comments" (
    "id" SERIAL NOT NULL,
    "discussionsId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_discussionsId_fkey" FOREIGN KEY ("discussionsId") REFERENCES "public"."Discussions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
