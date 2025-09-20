/*
  Warnings:

  - The primary key for the `Comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Discussions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_discussionsId_fkey";

-- AlterTable
ALTER TABLE "public"."Comments" DROP CONSTRAINT "Comments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "discussionsId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Comments_id_seq";

-- AlterTable
ALTER TABLE "public"."Discussions" DROP CONSTRAINT "Discussions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Discussions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Discussions_id_seq";

-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_discussionsId_fkey" FOREIGN KEY ("discussionsId") REFERENCES "public"."Discussions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
