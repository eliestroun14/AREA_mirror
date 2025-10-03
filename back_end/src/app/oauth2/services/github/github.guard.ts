import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GithubProvider,
  GithubProviderRequest,
} from '@app/oauth2/services/github/github.dto';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

@Injectable()
export class GithubOAuthGuard extends AuthGuard('github') {
  handleRequest<TUser = JwtPayload>(
    err: unknown,
    user: GithubProvider,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser {
    const req: GithubProviderRequest = context.switchToHttp().getRequest();

    req.provider = user;
    return req.user as TUser;
  }
}
