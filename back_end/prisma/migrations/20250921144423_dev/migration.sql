/*
  Warnings:

  - The primary key for the `POC_spotify_track` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."POC_spotify_track" DROP CONSTRAINT "POC_spotify_track_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "POC_spotify_track_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."POC_action" (
    "id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "POC_action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "POC_action_user_id_key" ON "public"."POC_action"("user_id");

-- AddForeignKey
ALTER TABLE "public"."POC_action" ADD CONSTRAINT "POC_action_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
