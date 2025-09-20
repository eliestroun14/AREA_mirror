-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Services" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "icon_url" TEXT,
    "api_base_url" TEXT,
    "auth_type" TEXT NOT NULL,
    "documentation_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Connections" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "rate_limit_remaining" INTEGER NOT NULL DEFAULT 1000,
    "rate_limit_reset" TIMESTAMP(3),
    "connection_name" TEXT,
    "account_identifier" TEXT,
    "scopes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Zaps" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "total_runs" INTEGER NOT NULL DEFAULT 0,
    "successful_runs" INTEGER NOT NULL DEFAULT 0,
    "failed_runs" INTEGER NOT NULL DEFAULT 0,
    "last_run_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Zaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Triggers" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trigger_type" TEXT NOT NULL,
    "polling_interval" INTEGER,
    "webhook_method" TEXT NOT NULL DEFAULT 'POST',
    "input_schema" JSONB,
    "output_schema" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Actions" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "http_method" TEXT NOT NULL DEFAULT 'POST',
    "endpoint_path" TEXT,
    "input_schema" JSONB,
    "output_schema" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ZapSteps" (
    "id" SERIAL NOT NULL,
    "zap_id" INTEGER NOT NULL,
    "step_order" INTEGER NOT NULL,
    "step_type" TEXT NOT NULL,
    "trigger_id" INTEGER,
    "action_id" INTEGER,
    "configuration" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZapSteps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ZapExecutions" (
    "id" SERIAL NOT NULL,
    "zap_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "trigger_data" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "duration_ms" INTEGER,
    "error_message" TEXT,
    "error_code" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "next_retry_at" TIMESTAMP(3),

    CONSTRAINT "ZapExecutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StepExecutions" (
    "id" SERIAL NOT NULL,
    "execution_id" INTEGER NOT NULL,
    "step_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "input_data" JSONB,
    "output_data" JSONB,
    "transformed_data" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "duration_ms" INTEGER,
    "error_message" TEXT,
    "error_code" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StepExecutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Webhooks" (
    "id" SERIAL NOT NULL,
    "trigger_id" INTEGER NOT NULL,
    "webhook_url" TEXT NOT NULL,
    "webhook_secret" TEXT NOT NULL,
    "expected_headers" JSONB,
    "signature_header" TEXT NOT NULL DEFAULT 'X-Signature',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "total_received" INTEGER NOT NULL DEFAULT 0,
    "last_received_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceFields" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "trigger_id" INTEGER,
    "action_id" INTEGER,
    "field_key" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "field_type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "default_value" TEXT,
    "validation_rules" JSONB,
    "field_options" JSONB,
    "help_text" TEXT,
    "placeholder" TEXT,
    "field_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServiceFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DataTransformations" (
    "id" SERIAL NOT NULL,
    "zap_step_id" INTEGER NOT NULL,
    "source_field" TEXT NOT NULL,
    "target_field" TEXT NOT NULL,
    "transformation_type" TEXT NOT NULL DEFAULT 'direct',
    "transformation_config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DataTransformations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExecutionLogs" (
    "id" SERIAL NOT NULL,
    "execution_id" INTEGER NOT NULL,
    "step_execution_id" INTEGER,
    "log_level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExecutionLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Services_name_key" ON "public"."Services"("name");

-- CreateIndex
CREATE INDEX "Services_active_idx" ON "public"."Services"("active");

-- CreateIndex
CREATE INDEX "Connections_user_id_idx" ON "public"."Connections"("user_id");

-- CreateIndex
CREATE INDEX "Connections_service_id_idx" ON "public"."Connections"("service_id");

-- CreateIndex
CREATE INDEX "Connections_user_id_service_id_idx" ON "public"."Connections"("user_id", "service_id");

-- CreateIndex
CREATE INDEX "Zaps_enabled_idx" ON "public"."Zaps"("enabled");

-- CreateIndex
CREATE INDEX "Zaps_user_id_idx" ON "public"."Zaps"("user_id");

-- CreateIndex
CREATE INDEX "Triggers_service_id_idx" ON "public"."Triggers"("service_id");

-- CreateIndex
CREATE INDEX "Triggers_active_idx" ON "public"."Triggers"("active");

-- CreateIndex
CREATE INDEX "Actions_service_id_idx" ON "public"."Actions"("service_id");

-- CreateIndex
CREATE INDEX "Actions_active_idx" ON "public"."Actions"("active");

-- CreateIndex
CREATE INDEX "ZapSteps_zap_id_idx" ON "public"."ZapSteps"("zap_id");

-- CreateIndex
CREATE INDEX "ZapSteps_trigger_id_idx" ON "public"."ZapSteps"("trigger_id");

-- CreateIndex
CREATE INDEX "ZapSteps_action_id_idx" ON "public"."ZapSteps"("action_id");

-- CreateIndex
CREATE INDEX "ZapExecutions_zap_id_idx" ON "public"."ZapExecutions"("zap_id");

-- CreateIndex
CREATE INDEX "StepExecutions_execution_id_idx" ON "public"."StepExecutions"("execution_id");

-- CreateIndex
CREATE INDEX "StepExecutions_step_id_idx" ON "public"."StepExecutions"("step_id");

-- CreateIndex
CREATE UNIQUE INDEX "Webhooks_webhook_url_key" ON "public"."Webhooks"("webhook_url");

-- CreateIndex
CREATE INDEX "Webhooks_trigger_id_idx" ON "public"."Webhooks"("trigger_id");

-- CreateIndex
CREATE INDEX "Webhooks_active_idx" ON "public"."Webhooks"("active");

-- CreateIndex
CREATE INDEX "ServiceFields_service_id_idx" ON "public"."ServiceFields"("service_id");

-- CreateIndex
CREATE INDEX "ServiceFields_trigger_id_idx" ON "public"."ServiceFields"("trigger_id");

-- CreateIndex
CREATE INDEX "ServiceFields_action_id_idx" ON "public"."ServiceFields"("action_id");

-- CreateIndex
CREATE INDEX "ServiceFields_active_idx" ON "public"."ServiceFields"("active");

-- CreateIndex
CREATE INDEX "DataTransformations_zap_step_id_idx" ON "public"."DataTransformations"("zap_step_id");

-- CreateIndex
CREATE INDEX "ExecutionLogs_execution_id_idx" ON "public"."ExecutionLogs"("execution_id");

-- CreateIndex
CREATE INDEX "ExecutionLogs_step_execution_id_idx" ON "public"."ExecutionLogs"("step_execution_id");

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connections" ADD CONSTRAINT "Connections_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Zaps" ADD CONSTRAINT "Zaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Triggers" ADD CONSTRAINT "Triggers_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actions" ADD CONSTRAINT "Actions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ZapSteps" ADD CONSTRAINT "ZapSteps_zap_id_fkey" FOREIGN KEY ("zap_id") REFERENCES "public"."Zaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ZapSteps" ADD CONSTRAINT "ZapSteps_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "public"."Triggers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ZapSteps" ADD CONSTRAINT "ZapSteps_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "public"."Actions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ZapExecutions" ADD CONSTRAINT "ZapExecutions_zap_id_fkey" FOREIGN KEY ("zap_id") REFERENCES "public"."Zaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StepExecutions" ADD CONSTRAINT "StepExecutions_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "public"."ZapExecutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StepExecutions" ADD CONSTRAINT "StepExecutions_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "public"."ZapSteps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Webhooks" ADD CONSTRAINT "Webhooks_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "public"."Triggers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceFields" ADD CONSTRAINT "ServiceFields_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceFields" ADD CONSTRAINT "ServiceFields_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "public"."Triggers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceFields" ADD CONSTRAINT "ServiceFields_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "public"."Actions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DataTransformations" ADD CONSTRAINT "DataTransformations_zap_step_id_fkey" FOREIGN KEY ("zap_step_id") REFERENCES "public"."ZapSteps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionLogs" ADD CONSTRAINT "ExecutionLogs_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "public"."ZapExecutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionLogs" ADD CONSTRAINT "ExecutionLogs_step_execution_id_fkey" FOREIGN KEY ("step_execution_id") REFERENCES "public"."StepExecutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
