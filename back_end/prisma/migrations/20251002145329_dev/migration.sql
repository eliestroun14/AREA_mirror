/*
  Warnings:

  - The primary key for the `connections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `account_identifier` on table `connections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."connections" DROP CONSTRAINT "connections_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "account_identifier" SET NOT NULL,
ADD CONSTRAINT "connections_pkey" PRIMARY KEY ("id", "user_id", "service_id", "account_identifier");

-- CreateIndex
CREATE INDEX "connections_account_identifier_idx" ON "public"."connections"("account_identifier");
