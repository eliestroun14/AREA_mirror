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

    const tokenFromState = request.query.state as string;
    const tokenFromQuery = request.query.token as string;
    if (tokenFromQuery) {
      request.headers.authorization = `Bearer ${tokenFromQuery}`;
    } else if (tokenFromState) {
      request.headers.authorization = `Bearer ${tokenFromState}`;
    } else {
      console.log('⚠️ No token found in query or state parameters');
    }

    return super.canActivate(context);
  }
}
