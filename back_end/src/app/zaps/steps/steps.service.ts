import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
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
    if (
      !connection &&
      trigger.trigger_type !== constants.trigger_types.schedule
    )
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

  async updateTriggerStep(
    zapId: number,
    userId: number,
    data: { triggerId?: number; accountIdentifier?: string; payload?: object },
  ): Promise<void> {
    const step = await this.prisma.zap_steps.findFirst({
      where: {
        zap_id: zapId,
        step_type: constants.step_types.trigger,
        step_order: 0,
      },
    });

    if (!step)
      throw new NotFoundException(
        `Trigger step not found for zap with id ${zapId}.`,
      );

    const updateData: {
      trigger_id?: number;
      connection_id?: number;
      payload?: object;
    } = {};

    if (data.triggerId !== undefined) {
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

      if (data.accountIdentifier !== undefined) {
        const connection = await this.connectionsService.getUserConnection(
          userId,
          service.id,
          data.accountIdentifier,
        );
        if (!connection)
          throw new NotFoundException(
            `The connection with account's id ${data.accountIdentifier} of service ${service.name} do not exists.`,
          );
        updateData.connection_id = connection.id;
      }

      updateData.trigger_id = data.triggerId;
    } else if (data.accountIdentifier !== undefined) {
      const currentTrigger = await this.prisma.triggers.findUnique({
        where: { id: step.trigger_id ?? undefined },
      });

      if (!currentTrigger)
        throw new NotFoundException(`Current trigger not found.`);

      const service = await this.prisma.services.findUnique({
        where: { id: currentTrigger.service_id },
      });

      if (!service)
        throw new NotFoundException(
          `Service with id ${currentTrigger.service_id} do not exists.`,
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

      updateData.connection_id = connection.id;
    }

    if (data.payload !== undefined) {
      updateData.payload = data.payload;
    }

    await this.prisma.zap_steps.update({
      where: { id: step.id },
      data: updateData,
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
      connection_id: Number(triggerStep.connection_id),
      step_type: 'TRIGGER',
      step_order: triggerStep.step_order,
      created_at: triggerStep.created_at,
      updated_at: triggerStep.updated_at,
      payload: triggerStep.payload as object,
    };
  }

  async deleteTriggerStep(zapId: number, userId: number): Promise<void> {
    const step = await this.prisma.zap_steps.findFirst({
      where: {
        zap_id: zapId,
        step_type: constants.step_types.trigger,
        step_order: 0,
      },
    });

    if (!step)
      throw new NotFoundException(
        `Trigger step not found for zap with id ${zapId}.`,
      );

    await this.prisma.zap_steps.delete({
      where: { id: step.id },
    });
  }

  async getActionStepsOf(zapId: number): Promise<StepDTO[]> {
    const actionSteps = await this.prisma.zap_steps.findMany({
      where: {
        zap_id: zapId,
        step_type: constants.step_types.action,
      },
      orderBy: {
        step_order: 'asc',
      },
    });

    return actionSteps.map((step) => ({
      id: step.id,
      zap_id: zapId,
      action_id: step.action_id,
      trigger_id: null,
      connection_id: Number(step.connection_id),
      step_type: 'ACTION' as const,
      step_order: step.step_order,
      created_at: step.created_at,
      updated_at: step.updated_at,
      payload: step.payload as object,
    }));
  }

  async getActionStepById(zapId: number, actionId: number): Promise<StepDTO> {
    const actionStep = await this.prisma.zap_steps.findFirst({
      where: {
        id: actionId,
        zap_id: zapId,
        step_type: constants.step_types.action,
      },
    });

    if (!actionStep)
      throw new NotFoundException(
        `Action with id ${actionId} not found for zap ${zapId}.`,
      );

    return {
      id: actionStep.id,
      zap_id: zapId,
      action_id: actionStep.action_id,
      trigger_id: null,
      connection_id: Number(actionStep.connection_id),
      step_type: 'ACTION' as const,
      step_order: actionStep.step_order,
      created_at: actionStep.created_at,
      updated_at: actionStep.updated_at,
      payload: actionStep.payload as object,
    };
  }

  async updateActionStep(
    zapId: number,
    actionId: number,
    userId: number,
    data: {
      actionId?: number;
      accountIdentifier?: string;
      payload?: object;
      stepOrder?: number;
      fromStepId?: number;
    },
  ): Promise<void> {
    const step = await this.prisma.zap_steps.findFirst({
      where: {
        id: actionId,
        zap_id: zapId,
        step_type: constants.step_types.action,
      },
    });

    if (!step)
      throw new NotFoundException(
        `Action with id ${actionId} not found for zap ${zapId}.`,
      );

    const updateData: {
      action_id?: number;
      connection_id?: number;
      payload?: object;
      step_order?: number;
      source_step_id?: number | null;
    } = {};

    // Si un nouveau actionId est fourni, on vérifie qu'il existe et on récupère le service
    if (data.actionId !== undefined) {
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

      // Si on change d'action mais pas de accountIdentifier, on garde l'ancienne connection
      if (data.accountIdentifier !== undefined) {
        const connection = await this.connectionsService.getUserConnection(
          userId,
          service.id,
          data.accountIdentifier,
        );
        if (!connection)
          throw new NotFoundException(
            `The connection with account's id ${data.accountIdentifier} of service ${service.name} do not exists.`,
          );
        updateData.connection_id = connection.id;
      }

      updateData.action_id = data.actionId;
    } else if (data.accountIdentifier !== undefined) {
      // Si on change seulement le accountIdentifier, on doit vérifier avec le service actuel
      const currentAction = await this.prisma.actions.findUnique({
        where: { id: step.action_id ?? undefined },
      });

      if (!currentAction)
        throw new NotFoundException(`Current action not found.`);

      const service = await this.servicesService.getServiceById(
        currentAction.service_id,
      );

      if (!service)
        throw new NotFoundException(
          `Service with id ${currentAction.service_id} do not exists.`,
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

      updateData.connection_id = connection.id;
    }

    // Mise à jour du payload si fourni
    if (data.payload !== undefined) {
      updateData.payload = data.payload;
    }

    // Mise à jour de step_order si fourni
    if (data.stepOrder !== undefined) {
      updateData.step_order = data.stepOrder;
    }

    // Mise à jour de la source (source_step_id) si fourni
    if (data.fromStepId !== undefined) {
      // Vérifier que la source existe et appartient au même zap
      const sourceStep = await this.prisma.zap_steps.findFirst({
        where: { id: data.fromStepId, zap_id: zapId },
      });
      if (!sourceStep)
        throw new NotFoundException(
          `Source step with id ${data.fromStepId} not found for zap ${zapId}.`,
        );

      // Vérifier que la source est bien avant l'action (ordre inférieur)
      if (sourceStep.step_order >= step.step_order)
        throw new BadRequestException(
          'Source step must be before the action step in order.',
        );

      updateData.source_step_id = data.fromStepId;
    }

    // Mise à jour du step
    await this.prisma.zap_steps.update({
      where: { id: step.id },
      data: updateData,
    });
  }

  async deleteActionStep(
    zapId: number,
    actionId: number,
    userId: number,
  ): Promise<void> {
    const step = await this.prisma.zap_steps.findFirst({
      where: {
        id: actionId,
        zap_id: zapId,
        step_type: constants.step_types.action,
      },
    });

    if (!step)
      throw new NotFoundException(
        `Action with id ${actionId} not found for zap ${zapId}.`,
      );

    await this.prisma.zap_steps.delete({
      where: { id: step.id },
    });
  }
}
