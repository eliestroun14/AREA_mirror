/*
  Warnings:

  - You are about to drop the column `active` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `services_color` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."services" DROP COLUMN "active",
DROP COLUMN "services_color",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "service_color" TEXT NOT NULL DEFAULT '#FFFFFF';

-- AlterTable
ALTER TABLE "public"."zaps" ALTER COLUMN "is_active" SET DEFAULT false,
ALTER COLUMN "total_runs" SET DEFAULT 0,
ALTER COLUMN "successful_runs" SET DEFAULT 0,
ALTER COLUMN "failed_runs" SET DEFAULT 0;
