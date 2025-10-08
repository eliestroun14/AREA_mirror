import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '@app/auth/auth.service';
import { SignInBody, SignInResponse, SignUpBody } from '@app/auth/auth.dto';
import { UserDTO } from '@app/users/users.dto';
import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
