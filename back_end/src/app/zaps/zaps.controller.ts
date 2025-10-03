import {
  UseGuards,
  Controller,
  Param,
  Body,
  Req,
  Post,
  Get,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  PostZapBody,
  PutZapBody,
  GetAllZapsResponse,
  GetZapResponse,
  PostZapResponse,
  DeleteZapResponse,
  PutZapResponse,
  PatchZapResponse,
  type GetZapByIdParams,
  type DeleteZapByIdParams,
  type PutZapByIdParams,
  PatchZapToggleBody,
  type PatchZapByIdParams,
  type PostZapTriggerParams,
  PostZapTriggerBody,
  PostZapTriggerResponse,
  type PostZapActionParams,
  PostZapActionBody,
  PostZapActionResponse,
} from './zaps.dto';
import { ZapsService } from './zaps.service';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { StepsService } from '@app/zaps/steps/steps.service';

@Controller('zaps')
export class ZapsController {
  constructor(
    private service: ZapsService,
    private stepsService: StepsService,
  ) {}

  // ========================
  //          CRUD
  // ========================
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllZaps(@Req() req: JwtRequest): Promise<GetAllZapsResponse> {
    const userId = req.user.userId;

    return await this.service.getAllUserZaps(userId);
  }

  @Get(':zapId')
  @UseGuards(JwtAuthGuard)
  async getZap(
    @Req() req: JwtRequest,
    @Param() params: GetZapByIdParams,
  ): Promise<GetZapResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (!userId) throw new UnauthorizedException('User not authenticated');
    if (isNaN(zapId)) throw new NotFoundException(`Zap ${zapId} not found.`);

    return await this.service.getZap(zapId, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createZap(
    @Req() req: JwtRequest,
    @Body() body: PostZapBody,
  ): Promise<PostZapResponse> {
    const userId = req.user.userId;
    return await this.service.createZap(userId, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':zapId')
  @UseGuards(JwtAuthGuard)
  async deleteZap(
    @Param() params: DeleteZapByIdParams,
    @Req() req: JwtRequest,
  ): Promise<DeleteZapResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${zapId} not found.`);

    await this.service.deleteZap(zapId, userId);
    return {
      message: `Zap ${zapId} deleted.`,
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  @Patch(':zapId')
  @UseGuards(JwtAuthGuard)
  async updateZap(
    @Param() params: PutZapByIdParams,
    @Body() body: PutZapBody,
    @Req() req: JwtRequest,
  ): Promise<PutZapResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${zapId} not found.`);

    if (!body.name && !body.description)
      throw new BadRequestException(
        'At least one field (name or description) must be provided.',
      );

    return await this.service.updateZap(zapId, userId, body);
  }

  @Patch(':zapId/toggle')
  @UseGuards(JwtAuthGuard)
  async toggleZap(
    @Param() params: PatchZapByIdParams,
    @Body() body: PatchZapToggleBody,
    @Req() req: JwtRequest,
  ): Promise<PatchZapResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);
    const is_active = body.is_active;

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);

    return await this.service.toggleZap(zapId, userId, is_active);
  }

  // ========================
  //        TRIGGERS
  // ========================
  @UseGuards(JwtAuthGuard)
  @Post(':zapId/trigger')
  async createZapTrigger(
    @Param() params: PostZapTriggerParams,
    @Body() body: PostZapTriggerBody,
    @Req() req: JwtRequest,
  ): Promise<PostZapTriggerResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);

    await this.stepsService.createTriggerStep(zapId, userId, body);

    return {
      zap_id: zapId,
    };
  }

  // ========================
  //         ACTIONS
  // ========================
  @UseGuards(JwtAuthGuard)
  @Post(':zapId/action')
  async createZapAction(
    @Param() params: PostZapActionParams,
    @Body() body: PostZapActionBody,
    @Req() req: JwtRequest,
  ): Promise<PostZapActionResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);

    await this.stepsService.createActionStep(zapId, userId, body);

    return {
      zap_id: zapId,
    };
  }
}
