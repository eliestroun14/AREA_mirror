import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  DiscordProvider,
  DiscordProviderRequest,
} from '@app/oauth2/services/discord/discord.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';
import { Request } from 'express';
import { CryptoService } from '../../crypto/crypto.service';

@Injectable()
export class DiscordOAuthGuard extends AuthGuard('discord') {
  constructor(private cryptoService: CryptoService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest<Request>();
    const encryptedToken =
      (request.query.token as string) || (request.query.state as string);
    console.log('[DiscordOAuthGuard] Query token param:', encryptedToken);

    if (!encryptedToken) {
      console.error(
        '[DiscordOAuthGuard] Encrypted token required but not found',
      );
      throw new UnauthorizedException('Encrypted token required');
    }

    const decrypted = this.cryptoService.decryptJWT(encryptedToken);
    console.log('[DiscordOAuthGuard] Decrypted token:', decrypted);

    if (!decrypted) {
      console.error('[DiscordOAuthGuard] Invalid or expired encrypted token');
      throw new UnauthorizedException('Invalid or expired encrypted token');
    }

    request['oauth_jwt'] = decrypted.jwt;

    const callbackToken = this.cryptoService.encryptJWT(
      decrypted.jwt,
      decrypted.platform,
    );

    return {
      state: callbackToken,
    };
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
