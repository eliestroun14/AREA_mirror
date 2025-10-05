/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `connections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `connection_id` to the `zap_steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."zap_steps" ADD COLUMN     "connection_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "connections_id_key" ON "public"."connections"("id");

-- CreateIndex
CREATE INDEX "zap_steps_connection_id_idx" ON "public"."zap_steps"("connection_id");

-- AddForeignKey
ALTER TABLE "public"."zap_steps" ADD CONSTRAINT "zap_steps_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "public"."connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
