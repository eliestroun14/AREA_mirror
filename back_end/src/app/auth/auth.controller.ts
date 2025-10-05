import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { SignInBody, SignUpBody, SignUpResponse } from '@app/auth/auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpBody): Promise<SignUpResponse> {
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
