import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from '@app/auth/auth.service';
import { SignInBody, SignInResponse, SignUpBody } from '@app/auth/auth.dto';
import { UserDTO } from '@app/users/users.dto';
import type { Response } from 'express';
import { GoogleOauthLoginOAuthGuard } from '@root/services/google-oauth-login/oauth2/google-oauth-login.guard';
import type { StrategyCallbackRequest } from '@app/oauth2/oauth2.dto';
import type * as express from 'express';
import { RequestWithQuery } from '@app/oauth2/services/service.dto';
import { Crypto } from '@config/crypto';
import { envConstants } from '@config/env';
import { type GoogleStrategyCallbackRequest } from '@root/services/google-oauth-login/oauth2/google-oauth-login.dto';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { constants } from '@config/utils';
import { UsersService } from '@app/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private connectionService: ConnectionsService,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  @ApiOperation({
    summary: 'Créer un nouveau compte utilisateur',
    description:
      'Permet de créer un nouveau compte utilisateur avec email, nom et mot de passe.',
  })
  @ApiBody({ type: SignUpBody })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur créé avec succès',
    type: UserDTO,
  })
  @ApiResponse({
    status: 400,
    description:
      'Données invalides (email déjà utilisé, mot de passe faible, etc.)',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur',
  })
  async signUp(@Body() signUpDto: SignUpBody): Promise<UserDTO> {
    const user = await this.authService.signUp(signUpDto);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: new Date(user.created_at).toUTCString(),
      updated_at: new Date(user.updated_at).toUTCString(),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiOperation({
    summary: 'Se connecter avec email et mot de passe',
    description:
      'Authentifie un utilisateur et retourne un token JWT. Le token est également envoyé dans un cookie session_token.',
  })
  @ApiBody({ type: SignInBody })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie, token JWT retourné',
    type: SignInResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou mot de passe incorrect',
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur',
  })
  async signIn(@Body() signInDto: SignInBody, @Res() res: Response) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    res
      .cookie('session_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .status(HttpStatus.OK)
      .json({
        session_token: token,
      });
  }

  @Get('sign-in/google')
  @UseGuards(GoogleOauthLoginOAuthGuard)
  @ApiOperation({
    summary: "S'inscrire avec Google",
    description:
      "Redirige l'utilisateur vers la page d'authentification Google pour connecter son compte.",
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers Google OAuth2',
  })
  public async googleSignIn() {}

  @Get(`sign-in/google/callback`)
  @UseGuards(GoogleOauthLoginOAuthGuard)
  @ApiOperation({
    summary: 'Callback OAuth2 Google',
    description:
      'Endpoint de callback après authentification Google. Enregistre la connexion Google et redirige vers la page home.',
  })
  @ApiQuery({
    name: 'code',
    description: "Code d'autorisation OAuth2 retourné par Discord",
    required: true,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirection vers la page home',
  })
  @ApiResponse({
    status: 500,
    description: "Erreur lors de l'enregistrement de la connexion",
  })
  public async googleSignInRedirect(
    @Req() req: GoogleStrategyCallbackRequest,
    @Res() res: express.Response,
  ) {
    let user = await this.userService.getUserByEmail(
      req.provider.emails[0].value,
    );

    if (!user) {
      user = await this.authService.signUp({
        name: req.provider.displayName,
        password: '',
        email: req.provider.emails[0].value,
      });
    }
    if (!user.sso_connection_id) {
      const sso_connection = await this.connectionService.createConnection(
        constants.services.googleOauthLogin.name,
        user.id,
        req.provider,
      );
      await this.userService.linkSSO(user, sso_connection);
    }

    const token = await this.authService.signInSSO(user.email);
    const redirectUri = this.getRedirectUrl(req);

    res
      .cookie('session_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .status(HttpStatus.OK)
      .redirect(redirectUri);
  }

  private getRedirectUrl(req: StrategyCallbackRequest): string {
    const reqWithQuery = req as RequestWithQuery;
    const stateRaw =
      reqWithQuery.query &&
      typeof reqWithQuery.query === 'object' &&
      typeof reqWithQuery.query['state'] === 'string'
        ? reqWithQuery.query['state']
        : '';

    if (stateRaw) {
      const decrypted = Crypto.decryptJWT(stateRaw);
      if (
        decrypted?.platform === 'mobile' &&
        envConstants.mobile_home_url
      ) {
        return envConstants.mobile_home_url;
      }
    }

    return envConstants.web_home_url;
  }
}
