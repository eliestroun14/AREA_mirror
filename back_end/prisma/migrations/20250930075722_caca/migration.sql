/*
  Warnings:

  - You are about to drop the `Actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Connections` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DataTransformations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExecutionLogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `POC_action` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `POC_spotify_track` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `POC_trigger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceFields` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StepExecutions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Triggers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Webhooks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZapExecutions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZapSteps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Zaps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Actions" DROP CONSTRAINT "Actions_service_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Connections" DROP CONSTRAINT "Connections_service_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Connections" DROP CONSTRAINT "Connections_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."DataTransformations" DROP CONSTRAINT "DataTransformations_zap_step_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExecutionLogs" DROP CONSTRAINT "ExecutionLogs_execution_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExecutionLogs" DROP CONSTRAINT "ExecutionLogs_step_execution_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."POC_action" DROP CONSTRAINT "POC_action_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."POC_spotify_track" DROP CONSTRAINT "POC_spotify_track_trigger_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."POC_trigger" DROP CONSTRAINT "POC_trigger_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ServiceFields" DROP CONSTRAINT "ServiceFields_action_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ServiceFields" DROP CONSTRAINT "ServiceFields_service_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ServiceFields" DROP CONSTRAINT "ServiceFields_trigger_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StepExecutions" DROP CONSTRAINT "StepExecutions_execution_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."StepExecutions" DROP CONSTRAINT "StepExecutions_step_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Triggers" DROP CONSTRAINT "Triggers_service_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Webhooks" DROP CONSTRAINT "Webhooks_trigger_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ZapExecutions" DROP CONSTRAINT "ZapExecutions_zap_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ZapSteps" DROP CONSTRAINT "ZapSteps_action_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ZapSteps" DROP CONSTRAINT "ZapSteps_trigger_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ZapSteps" DROP CONSTRAINT "ZapSteps_zap_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Zaps" DROP CONSTRAINT "Zaps_user_id_fkey";

-- DropTable
DROP TABLE "public"."Actions";

-- DropTable
DROP TABLE "public"."Connections";

-- DropTable
DROP TABLE "public"."DataTransformations";

-- DropTable
DROP TABLE "public"."ExecutionLogs";

-- DropTable
DROP TABLE "public"."POC_action";

-- DropTable
DROP TABLE "public"."POC_spotify_track";

-- DropTable
DROP TABLE "public"."POC_trigger";

-- DropTable
DROP TABLE "public"."ServiceFields";

-- DropTable
DROP TABLE "public"."Services";

-- DropTable
DROP TABLE "public"."StepExecutions";

-- DropTable
DROP TABLE "public"."Triggers";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."Webhooks";

-- DropTable
DROP TABLE "public"."ZapExecutions";

-- DropTable
DROP TABLE "public"."ZapSteps";

-- DropTable
DROP TABLE "public"."Zaps";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."services" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon_url" TEXT,
    "api_base_url" TEXT,
    "auth_type" TEXT NOT NULL,
    "documentation_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."connections" (
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
    "last_used_at" TIMESTAMP(3),

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."http_request" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "endpoint" TEXT NOT NULL,
    "body_schema" JSONB NOT NULL,
    "header_schema" JSONB NOT NULL,

    CONSTRAINT "http_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."webhooks" (
    "id" SERIAL NOT NULL,
    "header_schema" JSONB NOT NULL,
    "body_schema" JSONB NOT NULL,
    "from_url" TEXT NOT NULL,
    "secret" TEXT,
    "total_received" INTEGER,
    "last_received_at" TIMESTAMP(3),

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."triggers" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "http_request_id" INTEGER,
    "webhook_id" INTEGER,
    "trigger_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "polling_interval" INTEGER,
    "fields" JSONB NOT NULL,
    "variables" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."actions" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "http_request_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "variables" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."zaps" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "total_runs" INTEGER NOT NULL,
    "successful_runs" INTEGER NOT NULL,
    "failed_runs" INTEGER NOT NULL,
    "last_run_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "zaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."zap_steps" (
    "id" SERIAL NOT NULL,
    "zap_id" INTEGER NOT NULL,
    "source_step_id" INTEGER,
    "step_type" TEXT NOT NULL,
    "trigger_id" INTEGER,
    "action_id" INTEGER,
    "step_order" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zap_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."zap_executions" (
    "id" SERIAL NOT NULL,
    "zap_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zap_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."zap_step_executions" (
    "id" SERIAL NOT NULL,
    "zap_step_id" INTEGER NOT NULL,
    "zap_execution_id" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "error" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zap_step_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "public"."services"("name");

-- AddForeignKey
ALTER TABLE "public"."connections" ADD CONSTRAINT "connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."connections" ADD CONSTRAINT "connections_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."triggers" ADD CONSTRAINT "triggers_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."triggers" ADD CONSTRAINT "triggers_http_request_id_fkey" FOREIGN KEY ("http_request_id") REFERENCES "public"."http_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."triggers" ADD CONSTRAINT "triggers_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "public"."webhooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."actions" ADD CONSTRAINT "actions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."actions" ADD CONSTRAINT "actions_http_request_id_fkey" FOREIGN KEY ("http_request_id") REFERENCES "public"."http_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zaps" ADD CONSTRAINT "zaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_steps" ADD CONSTRAINT "zap_steps_zap_id_fkey" FOREIGN KEY ("zap_id") REFERENCES "public"."zaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_steps" ADD CONSTRAINT "zap_steps_source_step_id_fkey" FOREIGN KEY ("source_step_id") REFERENCES "public"."zap_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_steps" ADD CONSTRAINT "zap_steps_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "public"."triggers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_steps" ADD CONSTRAINT "zap_steps_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "public"."actions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_executions" ADD CONSTRAINT "zap_executions_zap_id_fkey" FOREIGN KEY ("zap_id") REFERENCES "public"."zaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_step_executions" ADD CONSTRAINT "zap_step_executions_zap_step_id_fkey" FOREIGN KEY ("zap_step_id") REFERENCES "public"."zap_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."zap_step_executions" ADD CONSTRAINT "zap_step_executions_zap_execution_id_fkey" FOREIGN KEY ("zap_execution_id") REFERENCES "public"."zap_executions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
