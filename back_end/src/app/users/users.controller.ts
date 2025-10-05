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
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { JwtRequest } from '@app/auth/jwt/jwt.dto';
import type {
  DeleteMeResponse,
  GetMeResponse,
  PutMeResponse,
} from '@app/users/users.dto';
import { PutMeBody } from '@app/users/users.dto';
import { UsersService } from '@app/users/users.service';
import { ConnectionsService } from '@app/users/connections/connections.service';
import type {
  GetAllConnectionsResponse,
  GetConnectionsByServiceResponse,
  ConnectionResponseDTO,
} from '@app/users/connections/connection.dto';

@Controller('users')
export class UsersController {
  constructor(
    private service: UsersService,
    private connectionsService: ConnectionsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(JwtAuthGuard)
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
  async deleteMe(@Req() req: JwtRequest): Promise<DeleteMeResponse> {
    const user = await this.service.deleteUser({ id: req.user.userId });

    return {
      message: 'Your account has been deleted.',
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('me/connections')
  @UseGuards(JwtAuthGuard)
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
}
