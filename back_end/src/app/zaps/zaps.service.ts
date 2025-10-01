import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import {
  CreateZapBody,
  UpdateZapBody,
  GetAllZapsResponse,
  GetZapResponse,
  CreateZapResponse,
  DeleteZapResponse,
  UpdateZapResponse,
  ActivateZapResponse,
} from './zaps.dto';

@Injectable()
export class ZapsService {
  constructor(private prisma: PrismaService) {}

  async getAllZaps(userId: number): Promise<GetAllZapsResponse> {
    const zaps = await this.prisma.zaps.findMany({
      where: { user_id: userId },
    });
    return zaps.map((zap) => ({
      id: zap.id,
      user_id: zap.user_id,
      name: zap.name,
      description: zap.description,
      is_active: zap.is_active,
      created_at: zap.created_at?.toISOString() ?? '',
      updated_at: zap.updated_at?.toISOString() ?? '',
    }));
  }

  async getZap(zapId: number, userId: number): Promise<GetZapResponse> {
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapId, user_id: userId },
    });
    if (!zap) return null;
    return {
      id: zap.id,
      user_id: zap.user_id,
      name: zap.name,
      description: zap.description,
      is_active: zap.is_active,
      created_at: zap.created_at?.toISOString() ?? '',
      updated_at: zap.updated_at?.toISOString() ?? '',
    };
  }

  async createZap(
    userId: number,
    createZapDto: CreateZapBody,
  ): Promise<CreateZapResponse> {
    const zap = await this.prisma.zaps.create({
      data: {
        user_id: userId,
        name: createZapDto.name,
        description: createZapDto.description,
      },
    });
    return {
      id: zap.id,
      user_id: zap.user_id,
      name: zap.name,
      description: zap.description,
      is_active: zap.is_active,
      created_at: zap.created_at?.toISOString() ?? '',
      updated_at: zap.updated_at?.toISOString() ?? '',
    };
  }

  async deleteZap(zapId: number, userId: number): Promise<DeleteZapResponse> {
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapId, user_id: userId },
    });
    if (!zap) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Zap not found or not yours' },
        HttpStatus.NOT_FOUND,
      );
    }
    // Delete zap_step_executions linked to zap_steps of this zap
    const zapSteps = await this.prisma.zap_steps.findMany({
      where: { zap_id: zapId },
      select: { id: true },
    });
    const zapStepIds = zapSteps.map((step) => step.id);
    if (zapStepIds.length > 0) {
      await this.prisma.zap_step_executions.deleteMany({
        where: { zap_step_id: { in: zapStepIds } },
      });
    }
    // Delete zap_step_executions linked to zap_executions of this zap
    const zapExecutions = await this.prisma.zap_executions.findMany({
      where: { zap_id: zapId },
      select: { id: true },
    });
    const zapExecutionIds = zapExecutions.map((exec) => exec.id);
    if (zapExecutionIds.length > 0) {
      await this.prisma.zap_step_executions.deleteMany({
        where: { zap_execution_id: { in: zapExecutionIds } },
      });
    }
    // Delete zap_steps
    await this.prisma.zap_steps.deleteMany({ where: { zap_id: zapId } });
    // Delete zap_executions
    await this.prisma.zap_executions.deleteMany({ where: { zap_id: zapId } });
    // Delete the zap itself
    await this.prisma.zaps.delete({ where: { id: zapId } });
    return { message: `Zap ${zapId} and all related entities deleted.` };
  }

  async updateZap(
    zapId: number,
    updateZapDto: UpdateZapBody,
    userId: number,
  ): Promise<UpdateZapResponse> {
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapId, user_id: userId },
    });
    if (!zap) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Zap not found or not yours' },
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedZap = await this.prisma.zaps.update({
      where: { id: zapId },
      data: {
        ...(updateZapDto.name && { name: updateZapDto.name }),
        ...(updateZapDto.description && {
          description: updateZapDto.description,
        }),
      },
    });
    return {
      id: updatedZap.id,
      user_id: updatedZap.user_id,
      name: updatedZap.name,
      description: updatedZap.description,
      is_active: updatedZap.is_active,
      created_at: updatedZap.created_at?.toISOString() ?? '',
      updated_at: updatedZap.updated_at?.toISOString() ?? '',
    };
  }

  async activateZap(
    zapId: number,
    userId: number,
  ): Promise<ActivateZapResponse> {
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapId, user_id: userId },
      select: { is_active: true },
    });
    if (!zap) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Zap not found or not yours' },
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedZap = await this.prisma.zaps.update({
      where: { id: zapId },
      data: { is_active: !zap.is_active },
    });
    return {
      id: updatedZap.id,
      user_id: updatedZap.user_id,
      name: updatedZap.name,
      description: updatedZap.description,
      is_active: updatedZap.is_active,
      created_at: updatedZap.created_at?.toISOString() ?? '',
      updated_at: updatedZap.updated_at?.toISOString() ?? '',
    };
  }
}
