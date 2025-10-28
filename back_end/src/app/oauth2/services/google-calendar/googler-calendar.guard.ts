import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GoogleCalendarProvider,
  GoogleCalendarProviderRequest,
} from '@app/oauth2/services/google-calendar/google-calendar.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';
import { Request } from 'express';
import { CryptoService } from '../../crypto/crypto.service';

@Injectable()
export class GoogleCalendarOAuthGuard extends AuthGuard('google-calendar') {
  constructor(private cryptoService: CryptoService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext): any {
    const request = context.switchToHttp().getRequest<Request>();
    const encryptedToken =
      (request.query.token as string) || (request.query.state as string);
    console.log('[GoogleCalendarOAuthGuard] Query token param:', encryptedToken);

    if (!encryptedToken) {
      console.error(
        '[GoogleCalendarOAuthGuard] Encrypted token required but not found',
      );
      throw new UnauthorizedException('Encrypted token required');
    }

    const decrypted = this.cryptoService.decryptJWT(encryptedToken);
    console.log('[GoogleCalendarOAuthGuard] Decrypted token:', decrypted);

    if (!decrypted) {
      console.error('[GoogleCalendarOAuthGuard] Invalid or expired encrypted token');
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
    user: GoogleCalendarProvider,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    const req: GoogleCalendarProviderRequest = context.switchToHttp().getRequest();
    req.provider = user;
    return req.user as TUser;
  }
}
