import { ExecutionContext, Injectable } from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class DeezerLinkGuard extends AuthGuard('deezer') {
  handleRequest(err: any, provider: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    req.provider = provider;
    return req.user;
  }
}
