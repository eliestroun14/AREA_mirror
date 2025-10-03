import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
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

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

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
}
