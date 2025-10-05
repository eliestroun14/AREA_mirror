/*
  Warnings:

  - The primary key for the `connections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `connections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."connections" DROP CONSTRAINT "connections_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "connections_pkey" PRIMARY KEY ("user_id", "service_id");
