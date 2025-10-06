/*
  Warnings:

  - Added the required column `class_name` to the `actions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_name` to the `triggers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."actions" ADD COLUMN     "class_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."triggers" ADD COLUMN     "class_name" TEXT NOT NULL;
