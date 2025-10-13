import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { JwtRequest } from '@app/auth/jwt/jwt.dto';
import type { GetMeResponse, PutMeResponse } from '@app/users/users.dto';
import {
  PutMeBody,
  DeleteMeResponse,
  LogoutMeResponse,
  UserDTO,
} from '@app/users/users.dto';
import type { Response } from 'express';
import { UsersService } from '@app/users/users.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import {
  GetAllConnectionsResponse,
  GetConnectionsByServiceResponse,
  ConnectionResponseDTO,
} from '@app/users/connections/connection.dto';
import { ActivityService } from '@app/users/activity/activity.service';
import { GetUserActivitiesResponse } from '@app/users/activity/activity.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private connectionsService: ConnectionsService,
    private activityService: ActivityService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtenir son profil utilisateur',
    description:
      "Retourne les informations du profil de l'utilisateur authentifié.",
  })
  @ApiResponse({
    status: 200,
    description: 'Profil récupéré avec succès',
    type: UserDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé',
  })
  async getMe(@Req() req: JwtRequest): Promise<GetMeResponse> {
    const user = await this.service.getUserById(req.user.userId);

    if (!user) throw new ForbiddenException('You are not authenticated.');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: new Date(user.created_at).toUTCString(),
      updated_at: new Date(user.updated_at).toUTCString(),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour son profil',
    description:
      "Permet de modifier l'email et le nom de l'utilisateur authentifié.",
  })
  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
    type: UserDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async putMe(
    @Req() req: JwtRequest,
    @Body() body: PutMeBody,
  ): Promise<PutMeResponse> {
    const user = await this.service.updateUser(
      {
        id: req.user.userId,
      },
      {
        email: body.email,
        name: body.name,
      },
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: new Date(user.created_at).toUTCString(),
      updated_at: new Date(user.updated_at).toUTCString(),
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer son compte',
    description:
      "Supprime définitivement le compte de l'utilisateur authentifié et toutes ses données.",
  })
  @ApiResponse({
    status: 204,
    description: 'Compte supprimé avec succès',
    type: DeleteMeResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async deleteMe(@Req() req: JwtRequest): Promise<DeleteMeResponse> {
    const user = await this.service.deleteUser({ id: req.user.userId });

    return {
      message: 'Your account has been deleted.',
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('me/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Se déconnecter',
    description:
      "Déconnecte l'utilisateur en supprimant les cookies d'authentification.",
  })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie',
    type: LogoutMeResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  logoutMe(@Res() res: Response): void {
    // Clear all authentication cookies
    res.clearCookie('session_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(HttpStatus.OK).json({
      message: 'You have been successfully logged out.',
      statusCode: HttpStatus.OK,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('me/connections')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtenir toutes ses connexions',
    description:
      "Retourne la liste de toutes les connexions OAuth2 de l'utilisateur (GitHub, Discord, Gmail, etc.).",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des connexions récupérée avec succès',
    type: GetAllConnectionsResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async getAllConnections(
    @Req() req: JwtRequest,
  ): Promise<GetAllConnectionsResponse> {
    const connections = await this.connectionsService.getAllUserConnections(
      req.user.userId,
    );

    const connectionsResponse: ConnectionResponseDTO[] = connections.map(
      (conn) => ({
        id: conn.id,
        service_id: conn.service_id,
        service_name: conn.service.name,
        service_color: conn.service.service_color,
        icon_url: conn.service.icon_url,
        connection_name: conn.connection_name,
        account_identifier: conn.account_identifier,
        is_active: conn.is_active,
        created_at: new Date(conn.created_at).toUTCString(),
        last_used_at: conn.last_used_at
          ? new Date(conn.last_used_at).toUTCString()
          : null,
      }),
    );

    return {
      connections: connectionsResponse,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('me/connections/service/:serviceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtenir les connexions pour un service spécifique',
    description:
      "Retourne la liste des connexions de l'utilisateur pour un service donné (ex: toutes les connexions GitHub).",
  })
  @ApiParam({
    name: 'serviceId',
    description: 'Identifiant du service',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des connexions pour le service récupérée avec succès',
    type: GetConnectionsByServiceResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  async getConnectionsByService(
    @Req() req: JwtRequest,
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ): Promise<GetConnectionsByServiceResponse> {
    const connections =
      await this.connectionsService.getUserConnectionsByService(
        req.user.userId,
        serviceId,
      );

    const connectionsResponse: ConnectionResponseDTO[] = connections.map(
      (conn) => ({
        id: conn.id,
        service_id: conn.service_id,
        service_name: conn.service.name,
        service_color: conn.service.service_color,
        icon_url: conn.service.icon_url,
        connection_name: conn.connection_name,
        account_identifier: conn.account_identifier,
        is_active: conn.is_active,
        created_at: new Date(conn.created_at).toUTCString(),
        last_used_at: conn.last_used_at
          ? new Date(conn.last_used_at).toUTCString()
          : null,
      }),
    );

    return {
      connections: connectionsResponse,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('me/activities')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Obtenir l'historique d'activités de l'utilisateur",
    description:
      "Retourne les actions récentes de l'utilisateur (connexions, exécutions de zaps, ...).",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des activités récupérée avec succès',
    type: GetUserActivitiesResponse,
  })
  async getUserActivities(
    @Req() req: JwtRequest,
  ): Promise<GetUserActivitiesResponse> {
    const activities = await this.activityService.getActivitiesForUser(
      req.user.userId,
    );

    return {
      activities,
    };
  }
}
