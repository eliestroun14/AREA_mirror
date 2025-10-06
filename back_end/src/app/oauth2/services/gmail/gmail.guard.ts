import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GmailProvider,
  GmailProviderRequest,
} from '@app/oauth2/services/gmail/gmail.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';
import { Request } from 'express';

@Injectable()
export class GmailOAuthGuard extends AuthGuard('google') {
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
    user: GmailProvider,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    const req: GmailProviderRequest = context.switchToHttp().getRequest();

    req.provider = user;
    return req.user as TUser;
  }
}
