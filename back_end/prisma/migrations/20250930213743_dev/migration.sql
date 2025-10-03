-- AlterTable
ALTER TABLE "public"."services" ADD COLUMN     "services_color" TEXT NOT NULL DEFAULT '#FFFFFF';

-- CreateIndex
CREATE INDEX "actions_service_id_idx" ON "public"."actions"("service_id");

-- CreateIndex
CREATE INDEX "actions_http_request_id_idx" ON "public"."actions"("http_request_id");

-- CreateIndex
CREATE INDEX "connections_user_id_idx" ON "public"."connections"("user_id");

-- CreateIndex
CREATE INDEX "connections_service_id_idx" ON "public"."connections"("service_id");

-- CreateIndex
CREATE INDEX "triggers_service_id_idx" ON "public"."triggers"("service_id");

-- CreateIndex
CREATE INDEX "triggers_http_request_id_idx" ON "public"."triggers"("http_request_id");

-- CreateIndex
CREATE INDEX "triggers_webhook_id_idx" ON "public"."triggers"("webhook_id");

-- CreateIndex
CREATE INDEX "zap_executions_zap_id_idx" ON "public"."zap_executions"("zap_id");

-- CreateIndex
CREATE INDEX "zap_step_executions_zap_step_id_idx" ON "public"."zap_step_executions"("zap_step_id");

-- CreateIndex
CREATE INDEX "zap_step_executions_zap_execution_id_idx" ON "public"."zap_step_executions"("zap_execution_id");

-- CreateIndex
CREATE INDEX "zap_steps_zap_id_idx" ON "public"."zap_steps"("zap_id");

-- CreateIndex
CREATE INDEX "zap_steps_source_step_id_idx" ON "public"."zap_steps"("source_step_id");

-- CreateIndex
CREATE INDEX "zap_steps_trigger_id_idx" ON "public"."zap_steps"("trigger_id");

-- CreateIndex
CREATE INDEX "zap_steps_action_id_idx" ON "public"."zap_steps"("action_id");

-- CreateIndex
CREATE INDEX "zaps_user_id_idx" ON "public"."zaps"("user_id");
