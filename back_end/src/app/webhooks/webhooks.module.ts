import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WorkflowService } from '@root/workflows/workflows.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ZapsService } from '@app/zaps/zaps.service';
import { TriggersService } from '@app/services/triggers/triggers.service';
import { ActionsService } from '@app/services/actions/actions.service';

@Module({
  controllers: [WebhooksController],
  providers: [
    WorkflowService,
    PrismaService,
    ZapsService,
    TriggersService,
    ActionsService,
  ],
})
export class WebhooksModule {}
