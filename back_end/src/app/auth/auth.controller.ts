import {
  BadRequestException,
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

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  async signUp(
    @Body() signUpDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    if (
      typeof signUpDto.email !== 'string' ||
      !this.isValidEmail(signUpDto.email)
    )
      throw new BadRequestException('Invalid email format.');
    if (typeof signUpDto.password !== 'string')
      throw new BadRequestException('Invalid password format.');
    if (typeof signUpDto.name !== 'string')
      throw new BadRequestException('Invalid name format.');

    const { password: _, ...result } = await this.authService.signUp(signUpDto);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInRequestDto, @Res() res: Response) {
    if (
      typeof signInDto.email !== 'string' ||
      !this.isValidEmail(signInDto.email)
    )
      throw new BadRequestException('Invalid email format.');
    if (typeof signInDto.password !== 'string')
      throw new BadRequestException('Invalid password format.');

    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .status(HttpStatus.OK)
      .json({
        access_token: token,
      });
  }
}
