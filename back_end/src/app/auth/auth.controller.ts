import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import {
  SignInRequestDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '@app/auth/auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(
    @Body() signUpDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const { password: _, ...result } = await this.authService.signUp(signUpDto);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInRequestDto, @Res() res: Response) {
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
