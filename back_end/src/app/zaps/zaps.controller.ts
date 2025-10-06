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
  type GetZapTriggerParams,
  GetZapTriggerResponse,
  type PatchZapTriggerParams,
  PatchZapTriggerBody,
  PatchZapTriggerResponse,
  type DeleteZapTriggerParams,
  DeleteZapTriggerResponse,
  type PostZapActionParams,
  PostZapActionBody,
  PostZapActionResponse,
  type GetZapActionsParams,
  GetZapActionsResponse,
  type GetZapActionByIdParams,
  GetZapActionByIdResponse,
  type PatchZapActionByIdParams,
  PatchZapActionBody,
  PatchZapActionResponse,
  type DeleteZapActionByIdParams,
  DeleteZapActionResponse,
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

  @UseGuards(JwtAuthGuard)
  @Get(':zapId/trigger')
  async getZapTrigger(
    @Param() params: GetZapTriggerParams,
    @Req() req: JwtRequest,
  ): Promise<GetZapTriggerResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);

    // Vérifier que le zap appartient bien à l'utilisateur
    const zap = await this.service.getZap(zapId, userId);
    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    return await this.stepsService.getTriggerStepOf(zapId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':zapId/trigger')
  async updateZapTrigger(
    @Param() params: PatchZapTriggerParams,
    @Body() body: PatchZapTriggerBody,
    @Req() req: JwtRequest,
  ): Promise<PatchZapTriggerResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);

    if (
      body.triggerId === undefined &&
      body.accountIdentifier === undefined &&
      body.payload === undefined
    )
      throw new BadRequestException(
        'At least one field (triggerId, accountIdentifier, or payload) must be provided.',
      );

    await this.stepsService.updateTriggerStep(zapId, userId, body);

    return {
      zap_id: zapId,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':zapId/trigger')
  async deleteZapTrigger(
    @Param() params: DeleteZapTriggerParams,
    @Req() req: JwtRequest,
  ): Promise<DeleteZapTriggerResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);

    // Vérifier que le zap appartient bien à l'utilisateur
    const zap = await this.service.getZap(zapId, userId);
    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    await this.stepsService.deleteTriggerStep(zapId, userId);

    return {
      message: `Trigger for zap ${zapId} deleted.`,
      statusCode: HttpStatus.NO_CONTENT,
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

  @UseGuards(JwtAuthGuard)
  @Get(':zapId/actions')
  async getZapActions(
    @Param() params: GetZapActionsParams,
    @Req() req: JwtRequest,
  ): Promise<GetZapActionsResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);

    // Vérifier que le zap appartient bien à l'utilisateur
    const zap = await this.service.getZap(zapId, userId);
    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    return await this.stepsService.getActionStepsOf(zapId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':zapId/actions/:actionId')
  async getZapActionById(
    @Param() params: GetZapActionByIdParams,
    @Req() req: JwtRequest,
  ): Promise<GetZapActionByIdResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);
    const actionId = Number(params.actionId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);
    if (isNaN(actionId))
      throw new NotFoundException(
        `Action with id ${params.actionId} not found.`,
      );

    // Vérifier que le zap appartient bien à l'utilisateur
    const zap = await this.service.getZap(zapId, userId);
    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    return await this.stepsService.getActionStepById(zapId, actionId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':zapId/actions/:actionId')
  async updateZapAction(
    @Param() params: PatchZapActionByIdParams,
    @Body() body: PatchZapActionBody,
    @Req() req: JwtRequest,
  ): Promise<PatchZapActionResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);
    const actionId = Number(params.actionId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);
    if (isNaN(actionId))
      throw new NotFoundException(
        `Action with id ${params.actionId} not found.`,
      );

    if (
      body.actionId === undefined &&
      body.accountIdentifier === undefined &&
      body.payload === undefined &&
      body.stepOrder === undefined
    )
      throw new BadRequestException(
        'At least one field (actionId, accountIdentifier, payload, or stepOrder) must be provided.',
      );

    // Vérifier que le zap appartient bien à l'utilisateur
    const zap = await this.service.getZap(zapId, userId);
    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    await this.stepsService.updateActionStep(zapId, actionId, userId, body);

    return {
      action_id: actionId,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':zapId/actions/:actionId')
  async deleteZapAction(
    @Param() params: DeleteZapActionByIdParams,
    @Req() req: JwtRequest,
  ): Promise<DeleteZapActionResponse> {
    const userId = req.user.userId;
    const zapId = Number(params.zapId);
    const actionId = Number(params.actionId);

    if (isNaN(zapId))
      throw new NotFoundException(`Zap with id ${params.zapId} not found.`);
    if (isNaN(actionId))
      throw new NotFoundException(
        `Action with id ${params.actionId} not found.`,
      );

    // Vérifier que le zap appartient bien à l'utilisateur
    const zap = await this.service.getZap(zapId, userId);
    if (!zap) throw new NotFoundException(`Zap with id ${zapId} not found.`);

    await this.stepsService.deleteActionStep(zapId, actionId, userId);

    return {
      message: `Action ${actionId} for zap ${zapId} deleted.`,
      statusCode: HttpStatus.NO_CONTENT,
    };
  }
}
