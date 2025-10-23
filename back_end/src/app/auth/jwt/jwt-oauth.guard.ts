import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

/**
 * JWT Guard for OAuth flows that extracts JWT from:
 * 1. Query parameter 'token' (for initial OAuth request)
 * 2. Query parameter 'state' (for OAuth callback)
 * 3. Standard cookie 'session_token' (fallback)
 * 4. Authorization header (fallback)
 */
@Injectable()
export class JwtOAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    // 1. Prend le JWT injecté par le guard Discord si présent
    if (request['oauth_jwt']) {
      request.headers.authorization = `Bearer ${request['oauth_jwt']}`;
      console.log('[JwtOAuthGuard] Using JWT from request["oauth_jwt"]');
    } else {
      // 2. Utilise query.token uniquement (jamais query.state, qui peut être un token chiffré)
      const tokenFromQuery = request.query.token as string;
      if (tokenFromQuery) {
        request.headers.authorization = `Bearer ${tokenFromQuery}`;
        console.log('[JwtOAuthGuard] Using JWT from query.token');
      } else {
        console.log('⚠️ No token found in oauth_jwt or query.token');
      }
    }

    return super.canActivate(context);
  }
}
