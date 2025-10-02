import type { InputJsonValue } from '@prisma/client/runtime/library';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AddZapTriggerStepDTO } from './triggers.dto';

@Injectable()
export class TriggersService {
  constructor(private readonly prisma: PrismaService) {}

  async createZapTriggerStep(dto: AddZapTriggerStepDTO) {
    const existingStep = await this.prisma.zap_steps.findFirst({
      where: {
        zap_id: dto.zap_id,
        step_type: 'trigger',
      },
    });
    if (existingStep) {
      throw new BadRequestException('Trigger step already exists for this zap');
    }
    let safePayload: InputJsonValue = {};
    if (
      dto.payload &&
      typeof dto.payload === 'object' &&
      !Array.isArray(dto.payload)
    ) {
      safePayload = dto.payload as InputJsonValue;
    }
    const newStep = await this.prisma.zap_steps.create({
      data: {
        zap_id: dto.zap_id,
        step_order: dto.step_order,
        step_type: 'trigger',
        trigger_id: dto.trigger_id,
        payload: safePayload,
        source_step_id: dto.source_step_id ?? null,
      },
    });
    return newStep;
  }
  async getZapById(
    zapId: number,
  ): Promise<{ id: number; user_id: number } | null> {
    return this.prisma.zaps.findUnique({
      where: { id: zapId },
      select: { id: true, user_id: true },
    });
  }
}
