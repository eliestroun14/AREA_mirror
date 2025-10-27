import { CryptoService } from '@config/crypto';
import type { StrategyCallbackRequest } from '@app/oauth2/oauth2.dto';
import { envConstants } from '@config/env';
import {
  CanActivate,
  Type,
  Get,
  Controller,
  InternalServerErrorException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RequestWithQuery } from '@app/oauth2/services/service.dto';
import UnauthenticatedException from '@errors/unauthenticated';
import { services } from '@root/prisma/services-data/services.data';
import type * as express from 'express';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { JwtOAuthGuard } from '@app/auth/jwt/jwt-oauth.guard';
import { DiscordOAuthGuard } from '@app/oauth2/services/discord/discord.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function AREA_OAuth2Controller(
  endpoint: string,
  guard: Type<CanActivate> | CanActivate,
) {
  @Controller('oauth2')
  class OAuth2Controller {
    constructor(public connectionService: ConnectionsService) {}

    public getRedirectUrl(req: StrategyCallbackRequest): string {
      const reqWithQuery = req as RequestWithQuery;
      const stateRaw =
        reqWithQuery.query &&
        typeof reqWithQuery.query === 'object' &&
        typeof reqWithQuery.query['state'] === 'string'
          ? reqWithQuery.query['state']
          : '';

      if (stateRaw) {
        const decrypted = CryptoService.decryptJWT(stateRaw);
        if (
          decrypted?.platform === 'mobile' &&
          envConstants.mobile_oauth2_success_redirect_url
        ) {
          return envConstants.mobile_oauth2_success_redirect_url;
        }
      }

      return envConstants.web_oauth2_success_redirect_url;
    }

    public async applyRedirect(
      req: StrategyCallbackRequest,
      res: express.Response,
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

    public getPlatformFromState(
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
        const decrypted = CryptoService.decryptJWT(stateRaw);
        return decrypted?.platform;
      }
      return undefined;
    }

    @Get(endpoint)
    @UseGuards(JwtOAuthGuard, guard)
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
    public async auth() {}

    @Get(`${endpoint}/callback`)
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
    public async authRedirect(
      @Req() req: StrategyCallbackRequest,
      @Res() res: express.Response,
    ) {
      await this.applyRedirect(req, res);
    }
  }
  return OAuth2Controller;
}

// @Injectable()
// export class OAuth2ServiceController {
//   constructor(
//     private connectionService: ConnectionsService,
//   ) {}
//   protected async applyRedirect(
//     req: StrategyCallbackRequest,
//     res: express.Response,
//   ) {
//     const platform = this.getPlatformFromState(req);
//     if (!req.user) {
//       const errorMsg = 'Unauthorized';
//       if (platform === 'web') {
//         return res.redirect(
//           `/oauth/error?error=${encodeURIComponent(errorMsg)}`,
//         );
//       }
//       throw new UnauthenticatedException();
//     }
//
//     if (!req.provider) {
//       const errorMsg = `ProviderNotFound for user ${req.user?.userId ?? ''}`;
//       console.error(errorMsg);
//       if (platform === 'web') {
//         return res.redirect(
//           `/oauth/error?error=${encodeURIComponent(errorMsg)}`,
//         );
//       }
//       throw new InternalServerErrorException(errorMsg);
//     }
//
//     await this.connectionService.createConnection(
//       services.discord.name,
//       req.user.userId,
//       req.provider,
//     );
//
//     const redirectUrl = this.getRedirectUrl(req);
//     return res.redirect(redirectUrl);
//   }
// }
