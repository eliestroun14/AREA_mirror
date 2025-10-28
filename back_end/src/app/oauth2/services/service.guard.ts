import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Crypto } from '@config/crypto';
import { Request } from 'express';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';
import {
  OAuth2Provider,
  StrategyCallbackRequest,
} from '@app/oauth2/oauth2.dto';

export function AREA_AuthGuard(serviceName: string) {
  @Injectable()
  class OAuth2Guard extends AuthGuard(serviceName) {
    constructor() {
      super();
    }

    getAuthenticateOptions(context: ExecutionContext): any {
      const request = context.switchToHttp().getRequest<Request>();
      const encryptedToken =
        (request.query.token as string) || (request.query.state as string);
      console.log('[OAuthGuard] Query token param:', encryptedToken);

      if (!encryptedToken) {
        console.error('[OAuthGuard] Encrypted token required but not found');
        throw new UnauthorizedException('Encrypted token required');
      }

      const decrypted = Crypto.decryptJWT(encryptedToken);
      console.log('[OAuthGuard] Decrypted token:', decrypted);

      if (!decrypted) {
        console.error('[OAuthGuard] Invalid or expired encrypted token');
        throw new UnauthorizedException('Invalid or expired encrypted token');
      }

      request['oauth_jwt'] = decrypted.jwt;

      const callbackToken = Crypto.encryptJWT(
        decrypted.jwt,
        decrypted.platform,
      );

      return {
        state: callbackToken,
      };
    }

    handleRequest<TUser = JwtPayload>(
      err: unknown,
      user: OAuth2Provider,
      info: unknown,
      context: ExecutionContext,
      status?: unknown,
    ): TUser {
      const req: StrategyCallbackRequest = context.switchToHttp().getRequest();
      req.provider = user;
      return req.user as TUser;
    }
  }

  return OAuth2Guard;
}
