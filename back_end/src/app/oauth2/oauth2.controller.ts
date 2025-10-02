import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Oauth2Service } from '@app/oauth2/oauth2.service';
import { GmailOAuthGuard } from '@app/oauth2/services/gmail/gmail.guard';
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard';
import type { StrategyCallbackRequest } from '@app/oauth2/oauth2.dto';
import UnauthenticatedException from '@errors/unauthenticated';
import type { Response } from 'express';
import { envConstants } from '@config/env';

@Controller('oauth2')
export class Oauth2Controller {
  constructor(private service: Oauth2Service) {}

  @Get('gmail')
  @UseGuards(GmailOAuthGuard)
  gmailAuth() {}

  @Get('gmail/callback')
  @UseGuards(JwtAuthGuard, GmailOAuthGuard)
  async gmailAuthRedirect(
    @Req() req: StrategyCallbackRequest,
    // @Res() res: Response,
  ) {
    if (!req.user) throw new UnauthenticatedException();

    await this.service.createConnection('Gmail', req.user.userId, req.provider);

    return {
      message: 'Authentification réussie',
      user: req.user,
      provider: req.provider,
    };
  }
}
