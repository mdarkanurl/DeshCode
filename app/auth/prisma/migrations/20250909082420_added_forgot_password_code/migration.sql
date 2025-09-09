-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "forgotPasswordCode" INTEGER,
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';
