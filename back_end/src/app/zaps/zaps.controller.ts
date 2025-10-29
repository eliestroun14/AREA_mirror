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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
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
  ZapDTO,
} from './zaps.dto';
import { ZapsService } from './zaps.service';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { StepsService } from '@app/zaps/steps/steps.service';
import { StepDTO } from '@app/zaps/steps/steps.dto';

@ApiTags('zaps')
@ApiBearerAuth()
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
  @ApiOperation({
    summary: "Obtenir tous les zaps de l'utilisateur",
    description:
      "Retourne la liste de tous les zaps (automatisations) créés par l'utilisateur connecté.",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des zaps récupérée avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          user_id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
          is_active: { type: 'boolean' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
        },
      },
      example: [
        {
          id: 1,
          user_id: 42,
          name: 'Mon automatisation GitHub',
          description: "Envoie un message Discord lors d'un push",
          is_active: true,
          created_at: 'Mon, 04 Oct 2021 12:00:00 GMT',
          updated_at: 'Mon, 04 Oct 2021 12:30:00 GMT',
        },
        {
          id: 2,
          user_id: 42,
          name: 'Notifications Gmail',
          description: "Crée une issue GitHub à la réception d'un email",
          is_active: false,
          created_at: 'Tue, 05 Oct 2021 10:00:00 GMT',
          updated_at: 'Tue, 05 Oct 2021 10:15:00 GMT',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async getAllZaps(@Req() req: JwtRequest): Promise<GetAllZapsResponse> {
    const userId = req.user.userId;

    return await this.service.getAllUserZaps(userId);
  }

  @Get(':zapId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Obtenir un zap spécifique',
    description: "Retourne les détails d'un zap spécifique.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Zap trouvé',
    type: ZapDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: 'Créer un nouveau zap',
    description:
      "Crée un nouveau zap (automatisation) pour l'utilisateur connecté. Le zap est créé inactif par défaut (is_active: false).",
  })
  @ApiResponse({
    status: 201,
    description: 'Zap créé avec succès',
    type: ZapDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async createZap(
    @Req() req: JwtRequest,
    @Body() body: PostZapBody,
  ): Promise<PostZapResponse> {
    const userId = req.user.userId;
    return await this.service.createZap(userId, body);
  }

  @Delete(':zapId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Supprimer un zap',
    description: 'Supprime un zap et toutes ses étapes (trigger et actions).',
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Zap supprimé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: 'Mettre à jour un zap',
    description:
      "Met à jour le nom et/ou la description d'un zap. Au moins un champ doit être fourni.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Zap mis à jour avec succès',
    type: ZapDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Au moins un champ doit être fourni',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: 'Activer/Désactiver un zap',
    description:
      "Active ou désactive un zap. Un zap désactivé ne s'exécutera pas.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Statut du zap modifié avec succès',
    type: ZapDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: "Créer le trigger d'un zap",
    description:
      "Définit le trigger (déclencheur) d'un zap. Le trigger est l'événement qui déclenche l'exécution du zap.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 201,
    description: 'Trigger créé avec succès',
    type: PostZapTriggerResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: "Obtenir le trigger d'un zap",
    description: "Retourne les détails du trigger (step) d'un zap.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Trigger récupéré avec succès',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        zap_id: { type: 'number' },
        connection_id: { type: 'number' },
        step_type: { type: 'string', enum: ['TRIGGER', 'ACTION'] },
        trigger_id: { type: 'number', nullable: true },
        action_id: { type: 'number', nullable: true },
        step_order: { type: 'number' },
        payload: { type: 'object' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
      example: {
        id: 1,
        zap_id: 1,
        connection_id: 5,
        step_type: 'TRIGGER',
        trigger_id: 1,
        action_id: null,
        step_order: 0,
        payload: { repository: 'owner/repo' },
        created_at: '2021-10-04T12:00:00.000Z',
        updated_at: '2021-10-04T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap ou trigger non trouvé',
  })
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
  @ApiOperation({
    summary: "Mettre à jour le trigger d'un zap",
    description:
      "Modifie le trigger d'un zap. Au moins un champ doit être fourni.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Trigger mis à jour avec succès',
    type: PatchZapTriggerResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Au moins un champ doit être fourni',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: "Supprimer le trigger d'un zap",
    description: "Supprime le trigger d'un zap.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Trigger supprimé avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: 'Ajouter une action à un zap',
    description:
      'Ajoute une action à exécuter lorsque le trigger se déclenche. Un zap peut avoir plusieurs actions.',
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 201,
    description: 'Action créée avec succès',
    type: PostZapActionResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: "Obtenir toutes les actions d'un zap",
    description: "Retourne la liste de toutes les actions (steps) d'un zap.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Actions récupérées avec succès',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          zap_id: { type: 'number' },
          connection_id: { type: 'number' },
          step_type: { type: 'string', enum: ['TRIGGER', 'ACTION'] },
          trigger_id: { type: 'number', nullable: true },
          action_id: { type: 'number', nullable: true },
          step_order: { type: 'number' },
          payload: { type: 'object' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
        },
      },
      example: [
        {
          id: 2,
          zap_id: 1,
          connection_id: 8,
          step_type: 'ACTION',
          trigger_id: null,
          action_id: 1,
          step_order: 1,
          payload: {
            channel_id: '123456789',
            message: 'Nouveau push sur {{repository}}',
          },
          created_at: '2021-10-04T12:05:00.000Z',
          updated_at: '2021-10-04T12:05:00.000Z',
        },
        {
          id: 3,
          zap_id: 1,
          connection_id: 10,
          step_type: 'ACTION',
          trigger_id: null,
          action_id: 2,
          step_order: 2,
          payload: {
            to: 'admin@example.com',
            subject: 'Push notification',
            body: 'Un push a été effectué par {{author}}',
          },
          created_at: '2021-10-04T12:10:00.000Z',
          updated_at: '2021-10-04T12:10:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap non trouvé',
  })
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
  @ApiOperation({
    summary: 'Obtenir une action spécifique',
    description: "Retourne les détails d'une action spécifique d'un zap.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiParam({
    name: 'actionId',
    description: "Identifiant de l'action (step_id)",
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Action trouvée',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        zap_id: { type: 'number' },
        connection_id: { type: 'number' },
        step_type: { type: 'string', enum: ['TRIGGER', 'ACTION'] },
        trigger_id: { type: 'number', nullable: true },
        action_id: { type: 'number', nullable: true },
        step_order: { type: 'number' },
        payload: { type: 'object' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
      example: {
        id: 2,
        zap_id: 1,
        connection_id: 8,
        step_type: 'ACTION',
        trigger_id: null,
        action_id: 1,
        step_order: 1,
        payload: {
          channel_id: '123456789',
          message: 'Nouveau push sur {{repository}}',
        },
        created_at: '2021-10-04T12:05:00.000Z',
        updated_at: '2021-10-04T12:05:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap ou action non trouvé',
  })
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
  @ApiOperation({
    summary: 'Mettre à jour une action',
    description:
      "Modifie une action d'un zap. Au moins un champ doit être fourni.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiParam({
    name: 'actionId',
    description: "Identifiant de l'action (step_id)",
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Action mise à jour avec succès',
    type: PatchZapActionResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Au moins un champ doit être fourni',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap ou action non trouvé',
  })
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
      body.stepOrder === undefined &&
      body.fromStepId === undefined
    )
      throw new BadRequestException(
        'At least one field (actionId, accountIdentifier, payload, stepOrder or fromStepId) must be provided.',
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
  @ApiOperation({
    summary: 'Supprimer une action',
    description: "Supprime une action d'un zap.",
  })
  @ApiParam({
    name: 'zapId',
    description: 'Identifiant du zap',
    example: 1,
  })
  @ApiParam({
    name: 'actionId',
    description: "Identifiant de l'action (step_id)",
    example: 2,
  })
  @ApiResponse({
    status: 204,
    description: 'Action supprimée avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Zap ou action non trouvé',
  })
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
