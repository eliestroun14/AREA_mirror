import {
  BadRequestException,
  Controller,
  Get,
  Req,
  UseGuards
} from '@nestjs/common';
import {JwtAuthGuard} from "@app/auth/jwt/jwt-auth.guard";
import {AuthGuard} from "@nestjs/passport";
import {ServiceProviderData} from "@app/auth/services";
import {ConnectionService} from "@app/connection/connection.service";
import {SpotifyLinkGuard} from "@app/auth/services/spotify/spotify-link.guard";
import {DeezerLinkGuard} from "@app/auth/services/deezer/deezer-link.guard";
import {GoogleLinkGuard} from "@app/auth/services/google/google-link.guard";
import type {StrategyCallbackRequest} from "@app/connection/controller.dto";

@Controller('connection')
export class ConnectionController {

  constructor(private connectionService: ConnectionService) {}

  @Get('google')
  @UseGuards(GoogleLinkGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(JwtAuthGuard, GoogleLinkGuard)
  async googleAuthRedirect(@Req() req: StrategyCallbackRequest) {
    if (!req.user) throw new BadRequestException('Invalid request.');

    console.log(req.user);
    await this.connectionService.createGoogleConnection(
      req.user.userId,
      req.provider,
    );

    return {
      message: 'Authentification réussie',
      user: req.user,
      provider: req.provider,
    };
  }

  @Get('deezer')
  @UseGuards(AuthGuard('deezer'))
  async deezerAuth() {}

  @Get('deezer/callback')
  @UseGuards(DeezerLinkGuard)
  deezerAuthRedirect(@Req() req: StrategyCallbackRequest) {
    if (!req.user) throw new BadRequestException('Invalid request.');

    console.log('Authentication success :', req.user);

    // Ici, req.user contient l'utilisateur renvoyé par la stratégie
    return {
      message: 'Authentification réussie',
      user: req.user,
    };
  }

  @Get('spotify')
  @UseGuards(SpotifyLinkGuard)
  spotifyAuth() {
    console.log('redirecting...');
  }

  @Get('spotify/callback')
  @UseGuards(JwtAuthGuard, SpotifyLinkGuard)
  async spotifyAuthRedirect(@Req() req: StrategyCallbackRequest) {
    if (!req.user) throw new BadRequestException('Invalid request.');

    console.log(req.user);
    await this.connectionService.createSpotifyConnection(
      req.user.userId,
      req.provider,
    );

    return {
      message: 'Authentification réussie',
      user: req.user,
      provider: req.provider,
    };
  }
}
