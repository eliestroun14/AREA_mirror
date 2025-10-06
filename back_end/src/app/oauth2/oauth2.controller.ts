import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type * as express from 'express';
import { Oauth2Service } from '@app/oauth2/oauth2.service';
import { GmailOAuthGuard } from '@app/oauth2/services/gmail/gmail.guard';
import { JwtOAuthGuard } from '@app/auth/jwt/jwt-oauth.guard';
import type { StrategyCallbackRequest } from '@app/oauth2/oauth2.dto';
import UnauthenticatedException from '@errors/unauthenticated';
import { services } from '@root/prisma/services-data/services.data';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { DiscordOAuthGuard } from '@app/oauth2/services/discord/discord.guard';
import { GithubOAuthGuard } from '@app/oauth2/services/github/github.guard';
import type { Response } from 'express';
import { envConstants } from '@config/env';

@Controller('oauth2')
export class Oauth2Controller {
  constructor(
    private service: Oauth2Service,
    private connectionService: ConnectionsService,
  ) {}

  @Get(services.gmail.slug)
  @UseGuards(JwtOAuthGuard, GmailOAuthGuard)
  async gmailAuth() {}

  @Get(`${services.gmail.slug}/callback`)
  @UseGuards(JwtOAuthGuard, GmailOAuthGuard)
  async gmailAuthRedirect(
    @Req() req: StrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    if (!req.user) throw new UnauthenticatedException();

    await this.connectionService.createConnection(
      services.gmail.name,
      req.user.userId,
      req.provider,
    );

    // Redirect to success page instead of returning JSON
    return res.redirect(envConstants.web_oauth2_success_redirect_url);
  }

  @Get(services.discord.slug)
  @UseGuards(JwtOAuthGuard, DiscordOAuthGuard)
  async discordAuth() {}

  @Get(`${services.discord.slug}/callback`)
  @UseGuards(JwtOAuthGuard, DiscordOAuthGuard)
  async discordAuthRedirect(
    @Req() req: StrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    if (!req.user) throw new UnauthenticatedException();

    if (!req.provider) {
      console.error(`Discord provider not found for user ${req.user.userId}.`);
      throw new InternalServerErrorException();
    }

    await this.connectionService.createConnection(
      services.discord.name,
      req.user.userId,
      req.provider,
    );

    // Redirect to success page instead of returning JSON
    return res.redirect(envConstants.web_oauth2_success_redirect_url);
  }

  @Get(services.github.slug)
  @UseGuards(JwtOAuthGuard, GithubOAuthGuard)
  async githubAuth() {}

  @Get(`${services.github.slug}/callback`)
  @UseGuards(JwtOAuthGuard, GithubOAuthGuard)
  async githubAuthRedirect(
    @Req() req: StrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    if (!req.user) throw new UnauthenticatedException();

    if (!req.provider) {
      console.error(`Github provider not found for user ${req.user.userId}.`);
      throw new InternalServerErrorException();
    }

    await this.connectionService.createConnection(
      services.github.name,
      req.user.userId,
      req.provider,
    );

    // Redirect to success page instead of returning JSON
    return res.redirect(envConstants.web_oauth2_success_redirect_url);
  }
}
