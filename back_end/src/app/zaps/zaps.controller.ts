import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  Put,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { PrismaService } from '@root/prisma/prisma.service';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { JwtRequest } from '@app/auth/jwt/jwt.dto';

function getUserIdFromRequest(req: unknown): number | undefined {
  if (
    typeof req === 'object' &&
    req !== null &&
    'user' in req &&
    typeof (req as { user?: unknown }).user === 'object' &&
    (req as { user?: { userId?: unknown } }).user !== null &&
    typeof (req as { user: { userId?: unknown } }).user.userId === 'number'
  ) {
    return (req as { user: { userId: number } }).user.userId;
  }
  return undefined;
}

@Controller('zaps')
export class ZapsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllZaps(@Req() req: JwtRequest): Promise<GetAllZapsResponse> {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
        HttpStatus.UNAUTHORIZED,
      );
    }
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

  @Get(':zapId')
  @UseGuards(JwtAuthGuard)
  async getZap(
    @Param('zapId') zapId: string,
    @Req() req: JwtRequest,
  ): Promise<GetZapResponse> {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const zap = await this.prisma.zaps.findFirst({
      where: {
        id: Number(zapId),
        user_id: userId,
      },
    });
    if (!zap) return null;
    return {
      ...zap,
      created_at: zap.created_at?.toISOString() ?? '',
      updated_at: zap.updated_at?.toISOString() ?? '',
    };
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createZap(
    @Req() req: JwtRequest,
    @Body() createZapDto: CreateZapBody,
  ): Promise<CreateZapResponse> {
    try {
      const userId = getUserIdFromRequest(req);
      if (!userId) {
        throw new HttpException(
          { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const zap = await this.prisma.zaps.create({
        data: {
          user_id: userId,
          name: createZapDto.name,
          description: createZapDto.description,
        },
      });
      return {
        ...zap,
        created_at: zap.created_at?.toISOString() ?? '',
        updated_at: zap.updated_at?.toISOString() ?? '',
      };
    } catch (error: unknown) {
      let message = 'Erreur lors de la création du zap';
      if (typeof error === 'object' && error !== null && 'message' in error) {
        message = String((error as { message?: string }).message) || message;
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':zapId')
  @UseGuards(JwtAuthGuard)
  async deleteZap(
    @Param('zapId') zapId: string,
    @Req() req: JwtRequest,
  ): Promise<DeleteZapResponse> {
    const zapIdNum = Number(zapId);
    if (isNaN(zapIdNum)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'zapId must be a number',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // Vérifie que le zap appartient à l'utilisateur
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapIdNum, user_id: userId },
    });
    if (!zap) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Zap not found or not yours',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    // Delete zap_step_executions linked to zap_steps of this zap
    const zapSteps = await this.prisma.zap_steps.findMany({
      where: { zap_id: zapIdNum },
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
      where: { zap_id: zapIdNum },
      select: { id: true },
    });
    const zapExecutionIds = zapExecutions.map((exec) => exec.id);
    if (zapExecutionIds.length > 0) {
      await this.prisma.zap_step_executions.deleteMany({
        where: { zap_execution_id: { in: zapExecutionIds } },
      });
    }
    // Delete zap_steps
    await this.prisma.zap_steps.deleteMany({
      where: { zap_id: zapIdNum },
    });
    // Delete zap_executions
    await this.prisma.zap_executions.deleteMany({
      where: { zap_id: zapIdNum },
    });
    // Delete the zap itself
    await this.prisma.zaps.delete({
      where: { id: zapIdNum },
    });
    return { message: `Zap ${zapIdNum} and all related entities deleted.` };
  }

  @Put(':zapId')
  @UseGuards(JwtAuthGuard)
  async updateZap(
    @Param('zapId') zapId: string,
    @Body() updateZapDto: UpdateZapBody,
    @Req() req: JwtRequest,
  ): Promise<UpdateZapResponse> {
    const zapIdNum = Number(zapId);
    if (isNaN(zapIdNum)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'zapId must be a number',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!updateZapDto.name && !updateZapDto.description) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'At least one field (name or description) must be provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // Vérifie que le zap appartient à l'utilisateur
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapIdNum, user_id: userId },
    });
    if (!zap) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Zap not found or not yours',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      const updatedZap = await this.prisma.zaps.update({
        where: { id: zapIdNum },
        data: {
          ...(updateZapDto.name && { name: updateZapDto.name }),
          ...(updateZapDto.description && {
            description: updateZapDto.description,
          }),
        },
      });
      return {
        ...updatedZap,
        created_at: updatedZap.created_at?.toISOString() ?? '',
        updated_at: updatedZap.updated_at?.toISOString() ?? '',
      };
    } catch (error: unknown) {
      let message = 'Erreur lors de la modification du zap';
      if (typeof error === 'object' && error !== null && 'message' in error) {
        message = String((error as { message?: string }).message) || message;
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':zapId')
  @UseGuards(JwtAuthGuard)
  async activateZap(
    @Param('zapId') zapId: string,
    @Req() req: JwtRequest,
  ): Promise<ActivateZapResponse> {
    const zapIdNum = Number(zapId);
    if (isNaN(zapIdNum)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'zapId must be a number',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // Vérifie que le zap appartient à l'utilisateur
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const zap = await this.prisma.zaps.findFirst({
      where: { id: zapIdNum, user_id: userId },
      select: { is_active: true },
    });
    if (!zap) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Zap not found or not yours',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      // Inverse la valeur
      const updatedZap = await this.prisma.zaps.update({
        where: { id: zapIdNum },
        data: { is_active: !zap.is_active },
      });
      return {
        ...updatedZap,
        created_at: updatedZap.created_at?.toISOString() ?? '',
        updated_at: updatedZap.updated_at?.toISOString() ?? '',
      };
    } catch (error: unknown) {
      let message = "Erreur lors du changement d'état du zap";
      if (typeof error === 'object' && error !== null && 'message' in error) {
        message = String((error as { message?: string }).message) || message;
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
