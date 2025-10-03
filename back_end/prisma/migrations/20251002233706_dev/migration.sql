/*
  Warnings:

  - Made the column `total_received` on table `webhooks` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."actions" DROP CONSTRAINT "actions_http_request_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."actions" DROP CONSTRAINT "actions_service_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."connections" DROP CONSTRAINT "connections_service_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."connections" DROP CONSTRAINT "connections_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."triggers" DROP CONSTRAINT "triggers_service_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."zap_executions" DROP CONSTRAINT "zap_executions_zap_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."zap_step_executions" DROP CONSTRAINT "zap_step_executions_zap_execution_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."zap_step_executions" DROP CONSTRAINT "zap_step_executions_zap_step_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."zap_steps" DROP CONSTRAINT "zap_steps_action_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."zap_steps" DROP CONSTRAINT "zap_steps_trigger_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."zap_steps" DROP CONSTRAINT "zap_steps_zap_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."zaps" DROP CONSTRAINT "zaps_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."webhooks" ALTER COLUMN "total_received" SET NOT NULL,
ALTER COLUMN "total_received" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "public"."connections" ADD CONSTRAINT "connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."connections" ADD CONSTRAINT "connections_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."triggers" ADD CONSTRAINT "triggers_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."actions" ADD CONSTRAINT "actions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."actions" ADD CONSTRAINT "actions_http_request_id_fkey" FOREIGN KEY ("http_request_id") REFERENCES "public"."http_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zaps" ADD CONSTRAINT "zaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_steps" ADD CONSTRAINT "zap_steps_zap_id_fkey" FOREIGN KEY ("zap_id") REFERENCES "public"."zaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_steps" ADD CONSTRAINT "zap_steps_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "public"."triggers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_steps" ADD CONSTRAINT "zap_steps_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "public"."actions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_executions" ADD CONSTRAINT "zap_executions_zap_id_fkey" FOREIGN KEY ("zap_id") REFERENCES "public"."zaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_step_executions" ADD CONSTRAINT "zap_step_executions_zap_step_id_fkey" FOREIGN KEY ("zap_step_id") REFERENCES "public"."zap_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_step_executions" ADD CONSTRAINT "zap_step_executions_zap_execution_id_fkey" FOREIGN KEY ("zap_execution_id") REFERENCES "public"."zap_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
