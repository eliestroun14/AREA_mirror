import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import {
  SignInRequestDto,
  SignInResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '@app/auth/auth.dto';

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
  async signIn(
    @Body() signInDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    if (
      typeof signInDto.email !== 'string' ||
      !this.isValidEmail(signInDto.email)
    )
      throw new BadRequestException('Invalid email format.');
    if (typeof signInDto.password !== 'string')
      throw new BadRequestException('Invalid password format.');

    return {
      access_token: await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      ),
    };
  }
}
