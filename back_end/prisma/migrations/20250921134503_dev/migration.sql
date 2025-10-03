/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `POC_trigger` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "POC_trigger_user_id_key" ON "public"."POC_trigger"("user_id");
