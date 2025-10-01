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
import { ZapsService } from './zaps.service';
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
  constructor(private readonly zapsService: ZapsService) {}

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
    return await this.zapsService.getAllZaps(userId);
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
    return await this.zapsService.getZap(Number(zapId), userId);
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
      return await this.zapsService.createZap(userId, createZapDto);
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
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.zapsService.deleteZap(zapIdNum, userId);
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
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.zapsService.updateZap(zapIdNum, updateZapDto, userId);
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
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      throw new HttpException(
        { status: HttpStatus.UNAUTHORIZED, error: 'User not authenticated' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.zapsService.activateZap(zapIdNum, userId);
  }
}
