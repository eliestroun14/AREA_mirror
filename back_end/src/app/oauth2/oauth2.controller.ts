import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
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
import { envConstants } from '@config/env';
import { CryptoService } from './crypto/crypto.service';

interface RequestWithQuery extends StrategyCallbackRequest {
  query: Record<string, unknown>;
}

@ApiTags('oauth2')
@Controller('oauth2')
export class Oauth2Controller {
  constructor(
    private service: Oauth2Service,
    private connectionService: ConnectionsService,
    private cryptoService: CryptoService,
  ) {}

  private getRedirectUrl(req: StrategyCallbackRequest): string {
    const reqWithQuery = req as RequestWithQuery;
    const stateRaw =
      reqWithQuery.query &&
      typeof reqWithQuery.query === 'object' &&
      typeof reqWithQuery.query['state'] === 'string'
        ? reqWithQuery.query['state']
        : '';

    if (stateRaw) {
      const decrypted = this.cryptoService.decryptJWT(stateRaw);
      if (
        decrypted?.platform === 'mobile' &&
        envConstants.mobile_oauth2_success_redirect_url
      ) {
        return envConstants.mobile_oauth2_success_redirect_url;
      }
    }

    return envConstants.web_oauth2_success_redirect_url;
  }

  @Get(services.gmail.slug)
  @UseGuards(JwtOAuthGuard, GmailOAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Initier l'authentification OAuth2 avec Gmail",
    description:
      "Redirige l'utilisateur vers la page d'authentification Google pour connecter son compte Gmail. Nécessite un token chiffré dans le query param 'token', obtenu via /oauth2/encrypt-token. La plateforme (web ou mobile) est incluse dans le token chiffré.",
  })
  @ApiQuery({
    name: 'token',
    description: 'Token chiffré obtenu via /oauth2/encrypt-token',
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers Google OAuth2',
  })
  @ApiResponse({
    status: 401,
    description: 'Token chiffré manquant ou invalide',
  })
  async gmailAuth() {}

  @Get(`${services.gmail.slug}/callback`)
  @UseGuards(GmailOAuthGuard, JwtOAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Callback OAuth2 Gmail',
    description:
      "Endpoint de callback après authentification Google. Enregistre la connexion Gmail et redirige vers la page de succès. Le paramètre 'state' contient le token chiffré (JWT + plateforme).",
  })
  @ApiQuery({
    name: 'code',
    description: "Code d'autorisation OAuth2 retourné par Google",
    required: true,
  })
  @ApiQuery({
    name: 'state',
    description: 'Token chiffré (passé dans le state OAuth2)',
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers la page de succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 500,
    description: "Erreur lors de l'enregistrement de la connexion",
  })
  async gmailAuthRedirect(
    @Req() req: StrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    const platform = this.getPlatformFromState(req);
    if (!req.user) {
      const errorMsg = 'Unauthorized';
      if (platform === 'web') {
        return res.redirect(
          `/oauth/error?error=${encodeURIComponent(errorMsg)}`,
        );
      }
      throw new UnauthenticatedException();
    }

    await this.connectionService.createConnection(
      services.gmail.name,
      req.user.userId,
      req.provider,
    );

    const redirectUrl = this.getRedirectUrl(req);
    return res.redirect(redirectUrl);
  }

  @Get(services.discord.slug)
  @UseGuards(JwtOAuthGuard, DiscordOAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Initier l'authentification OAuth2 avec Discord",
    description:
      'Redirige l\'utilisateur vers la page d\'authentification Discord pour connecter son compte. Nécessite un token chiffré dans le query param "token".',
  })
  @ApiQuery({
    name: 'token',
    description: 'Token chiffré obtenu via /oauth2/encrypt-token',
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers Discord OAuth2',
  })
  @ApiResponse({
    status: 401,
    description: 'Token chiffré manquant ou invalide',
  })
  async discordAuth() {}

  @Get(`${services.discord.slug}/callback`)
  @UseGuards(DiscordOAuthGuard, JwtOAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Callback OAuth2 Discord',
    description:
      'Endpoint de callback après authentification Discord. Enregistre la connexion Discord et redirige vers la page de succès.',
  })
  @ApiQuery({
    name: 'code',
    description: "Code d'autorisation OAuth2 retourné par Discord",
    required: true,
  })
  @ApiQuery({
    name: 'state',
    description: 'Token chiffré (passé dans le state OAuth2)',
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers la page de succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 500,
    description: "Erreur lors de l'enregistrement de la connexion",
  })
  async discordAuthRedirect(
    @Req() req: StrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    const platform = this.getPlatformFromState(req);
    if (!req.user) {
      const errorMsg = 'Unauthorized';
      if (platform === 'web') {
        return res.redirect(
          `/oauth/error?error=${encodeURIComponent(errorMsg)}`,
        );
      }
      throw new UnauthenticatedException();
    }

    if (!req.provider) {
      const errorMsg = `ProviderNotFound for user ${req.user?.userId ?? ''}`;
      console.error(errorMsg);
      if (platform === 'web') {
        return res.redirect(
          `/oauth/error?error=${encodeURIComponent(errorMsg)}`,
        );
      }
      throw new InternalServerErrorException(errorMsg);
    }

    await this.connectionService.createConnection(
      services.discord.name,
      req.user.userId,
      req.provider,
    );

    const redirectUrl = this.getRedirectUrl(req);
    return res.redirect(redirectUrl);
  }

  @Get(services.github.slug)
  @UseGuards(JwtOAuthGuard, GithubOAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Initier l'authentification OAuth2 avec GitHub",
    description:
      "Redirige l'utilisateur vers la page d'authentification GitHub pour connecter son compte. Nécessite un token chiffré dans le query param 'token', obtenu via /oauth2/encrypt-token. La plateforme (web ou mobile) est incluse dans le token chiffré.",
  })
  @ApiQuery({
    name: 'token',
    description: 'Token chiffré obtenu via /oauth2/encrypt-token',
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers GitHub OAuth2',
  })
  @ApiResponse({
    status: 401,
    description: 'Token chiffré manquant ou invalide',
  })
  async githubAuth() {}

  @Get(`${services.github.slug}/callback`)
  @UseGuards(GithubOAuthGuard, JwtOAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Callback OAuth2 GitHub',
    description:
      "Endpoint de callback après authentification GitHub. Enregistre la connexion GitHub et redirige vers la page de succès. Le paramètre 'state' contient le token chiffré (JWT + plateforme).",
  })
  @ApiQuery({
    name: 'code',
    description: "Code d'autorisation OAuth2 retourné par GitHub",
    required: true,
  })
  @ApiQuery({
    name: 'state',
    description: 'Token chiffré (passé dans le state OAuth2)',
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers la page de succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 500,
    description: "Erreur lors de l'enregistrement de la connexion",
  })
  async githubAuthRedirect(
    @Req() req: StrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    const platform = this.getPlatformFromState(req);
    if (!req.user) {
      const errorMsg = 'Unauthorized';
      if (platform === 'web') {
        return res.redirect(
          `/oauth/error?error=${encodeURIComponent(errorMsg)}`,
        );
      }
      throw new UnauthenticatedException();
    }

    if (!req.provider) {
      const errorMsg = `ProviderNotFound for user ${req.user?.userId ?? ''}`;
      console.error(errorMsg);
      if (platform === 'web') {
        return res.redirect(
          `/oauth/error?error=${encodeURIComponent(errorMsg)}`,
        );
      }
      throw new InternalServerErrorException(errorMsg);
    }

    await this.connectionService.createConnection(
      services.github.name,
      req.user.userId,
      req.provider,
    );

    const redirectUrl = this.getRedirectUrl(req);
    return res.redirect(redirectUrl);
  }

  private getPlatformFromState(
    req: StrategyCallbackRequest,
  ): string | undefined {
    const reqWithQuery = req as RequestWithQuery;
    const stateRaw =
      reqWithQuery.query &&
      typeof reqWithQuery.query === 'object' &&
      typeof reqWithQuery.query['state'] === 'string'
        ? reqWithQuery.query['state']
        : '';
    if (stateRaw) {
      const decrypted = this.cryptoService.decryptJWT(stateRaw);
      return decrypted?.platform;
    }
    return undefined;
  }
}
