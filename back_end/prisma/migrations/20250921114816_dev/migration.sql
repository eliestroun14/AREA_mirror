/*
  Warnings:

  - Added the required column `user_id` to the `POC_trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."POC_trigger" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."POC_trigger" ADD CONSTRAINT "POC_trigger_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
