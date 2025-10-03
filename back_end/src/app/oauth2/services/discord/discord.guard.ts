import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  DiscordProvider,
  DiscordProviderRequest,
} from '@app/oauth2/services/discord/discord.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

@Injectable()
export class DiscordOAuthGuard extends AuthGuard('discord') {
  handleRequest<TUser = JwtPayload>(
    err: unknown,
    user: DiscordProvider,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    const req: DiscordProviderRequest = context.switchToHttp().getRequest();

    req.provider = user;
    return req.user as TUser;
  }
}
