-- CreateTable
CREATE TABLE "public"."POC_trigger" (
    "id" SERIAL NOT NULL,
    "access_token" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "POC_trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."POC_spotify_track" (
    "id" INTEGER NOT NULL,
    "trigger_id" INTEGER NOT NULL,

    CONSTRAINT "POC_spotify_track_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."POC_spotify_track" ADD CONSTRAINT "POC_spotify_track_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "public"."POC_trigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
