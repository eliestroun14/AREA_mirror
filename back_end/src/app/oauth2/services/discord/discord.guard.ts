import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  DiscordProvider,
  DiscordProviderRequest,
} from '@app/oauth2/services/discord/discord.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';
import { Request } from 'express';

@Injectable()
export class DiscordOAuthGuard extends AuthGuard('discord') {
  /**
   * Override getAuthenticateOptions to pass the JWT token as state parameter
   * This allows the token to be preserved through the OAuth flow
   */
  getAuthenticateOptions(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest<Request>();
    const tokenFromQuery = request.query.token as string;
    // Pass the JWT token via the state parameter
    if (tokenFromQuery) {
      return {
        state: tokenFromQuery,
      };
    }
    return {};
  }

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
