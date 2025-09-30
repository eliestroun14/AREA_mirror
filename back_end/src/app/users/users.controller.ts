import {
  Controller,
  ForbiddenException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { JwtRequest } from '@app/auth/jwt/jwt.dto';
import { GetMeResponse } from '@app/users/users.dto';
import { UsersService } from '@app/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: JwtRequest): Promise<GetMeResponse> {
    const user = await this.service.getUserById(req.user.userId);

    if (!user) throw new ForbiddenException('You are not authenticated.');

    return {
      email: user.email,
      name: user.name,
      created_at: user.created_at.toString(),
      updated_at: user.updated_at.toString(),
    };
  }
}
