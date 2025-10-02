import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GmailProvider,
  GmailProviderRequest,
} from '@app/oauth2/services/gmail/gmail.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

@Injectable()
export class GmailOAuthGuard extends AuthGuard('google') {
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
