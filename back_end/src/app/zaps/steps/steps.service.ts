import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostZapActionBody, PostZapTriggerBody } from '@app/zaps/zaps.dto';
import { constants } from '@config/utils';
import { PrismaService } from '@root/prisma/prisma.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { StepDTO } from '@app/zaps/steps/steps.dto';
import { ServicesService } from '@app/services/services.service';

@Injectable()
export class StepsService {
  constructor(
    private prisma: PrismaService,
    private connectionsService: ConnectionsService,
    private servicesService: ServicesService,
  ) {}

  async createTriggerStep(
    zapId: number,
    userId: number,
    data: PostZapTriggerBody,
  ): Promise<void> {
    const step = await this.prisma.zap_steps.findFirst({
      where: {
        zap_id: zapId,
        step_type: constants.step_types.trigger,
        step_order: 0,
      },
    });
    if (step)
      throw new ConflictException(
        'The trigger step is already defined for this zap.',
      );

    const trigger = await this.prisma.triggers.findUnique({
      where: { id: data.triggerId },
    });
    if (!trigger)
      throw new NotFoundException(
        `Trigger with id ${data.triggerId} do not exists.`,
      );

    const service = await this.prisma.services.findUnique({
      where: { id: trigger.service_id },
    });
    if (!service)
      throw new NotFoundException(
        `Service with id ${trigger.service_id} do not exists.`,
      );

    const connection = await this.connectionsService.getUserConnection(
      userId,
      service.id,
      data.accountIdentifier,
    );
    if (!connection)
      throw new NotFoundException(
        `The connection with account's id ${data.accountIdentifier} of service ${service.name} do not exists.`,
      );

    await this.prisma.zap_steps.create({
      data: {
        zap_id: zapId,
        trigger_id: data.triggerId,
        step_type: constants.step_types.trigger,
        step_order: 0,
        connection_id: connection.id,
        payload: data.payload,
      },
    });
  }

  async createActionStep(
    zapId: number,
    userId: number,
    data: PostZapActionBody,
  ) {
    const action = await this.prisma.actions.findUnique({
      where: { id: data.actionId },
    });
    if (!action)
      throw new NotFoundException(
        `Action with id ${data.actionId} do not exists.`,
      );

    const service = await this.servicesService.getServiceById(
      action.service_id,
    );
    if (!service)
      throw new NotFoundException(
        `Service with id ${action.service_id} do not exists.`,
      );

    const connection = await this.connectionsService.getUserConnection(
      userId,
      service.id,
      data.accountIdentifier,
    );
    if (!connection)
      throw new NotFoundException(
        `The connection with account's id ${data.accountIdentifier} of service ${service.name} do not exists.`,
      );

    await this.prisma.zap_steps.create({
      data: {
        zap_id: zapId,
        source_step_id: data.fromStepId,
        action_id: data.actionId,
        step_type: constants.step_types.action,
        step_order: data.stepOrder,
        connection_id: connection.id,
        payload: data.payload,
      },
    });
  }

  async getTriggerStepOf(zapId: number): Promise<StepDTO> {
    const triggerStep = await this.prisma.zap_steps.findFirst({
      where: {
        zap_id: zapId,
        OR: [{ step_order: 0 }, { step_type: constants.step_types.trigger }],
      },
    });

    if (!triggerStep)
      throw new NotFoundException(
        `Zap with id ${zapId} does not have a trigger.`,
      );

    return {
      id: triggerStep.id,
      zap_id: zapId,
      action_id: null,
      trigger_id: triggerStep.trigger_id,
      connection_id: triggerStep.connection_id,
      step_type: 'TRIGGER',
      step_order: triggerStep.step_order,
      created_at: triggerStep.created_at,
      updated_at: triggerStep.updated_at,
      payload: triggerStep.payload as object,
    };
  }
}
