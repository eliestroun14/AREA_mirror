import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import {
  PostZapBody,
  PutZapBody,
  GetAllZapsResponse,
  GetZapResponse,
  PostZapResponse,
  PutZapResponse,
  PatchZapResponse,
  PostZapTriggerBody,
  PostZapActionBody,
} from './zaps.dto';
import { constants, formateDate } from '@config/utils';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { ServicesService } from '@app/services/services.service';

@Injectable()
export class ZapsService {
  constructor(
    private prisma: PrismaService,
    private connectionsService: ConnectionsService,
    private servicesService: ServicesService,
  ) {}

  async getAllZaps(): Promise<GetAllZapsResponse> {
    const zaps = await this.prisma.zaps.findMany();
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

  async getAllUserZaps(userId: number): Promise<GetAllZapsResponse> {
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

    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

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

  async createZap(userId: number, data: PostZapBody): Promise<PostZapResponse> {
    const zap = await this.prisma.zaps.create({
      data: {
        user_id: userId,
        name: data.name || 'Nouveau Zap',
        description: data.description || 'Description du zap',
      },
    });

    return {
      id: zap.id,
      user_id: zap.user_id,
      name: zap.name,
      description: zap.description,
      is_active: zap.is_active,
      created_at: formateDate(zap.created_at) ?? '',
      updated_at: formateDate(zap.updated_at) ?? '',
    };
  }

  async deleteZap(zapId: number, userId: number): Promise<void> {
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapId, user_id: userId },
    });

    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    await this.prisma.zaps.delete({ where: { id: zapId } });
  }

  async updateZap(
    zapId: number,
    userId: number,
    data: PutZapBody,
  ): Promise<PutZapResponse> {
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapId, user_id: userId },
    });

    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    const updatedData = {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
    };

    const updatedZap = await this.prisma.zaps.update({
      where: { id: zapId },
      data: updatedData,
    });

    return {
      id: updatedZap.id,
      user_id: updatedZap.user_id,
      name: updatedZap.name,
      description: updatedZap.description,
      is_active: updatedZap.is_active,
      created_at: formateDate(updatedZap.created_at) ?? '',
      updated_at: formateDate(updatedZap.updated_at) ?? '',
    };
  }

  async toggleZap(
    zapId: number,
    userId: number,
    is_active: boolean,
  ): Promise<PatchZapResponse> {
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapId, user_id: userId },
      select: { is_active: true },
    });

    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    const updatedZap = await this.prisma.zaps.update({
      where: { id: zapId },
      data: { is_active },
    });

    return {
      id: updatedZap.id,
      user_id: updatedZap.user_id,
      name: updatedZap.name,
      description: updatedZap.description,
      is_active: updatedZap.is_active,
      created_at: formateDate(updatedZap.created_at) ?? '',
      updated_at: formateDate(updatedZap.updated_at) ?? '',
    };
  }
}
