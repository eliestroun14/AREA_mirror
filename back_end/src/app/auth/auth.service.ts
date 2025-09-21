import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from '@app/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import '@config/env';
import { envConstants } from '@app/auth/constants';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await bcrypt.hash(
      data.password,
      Number(envConstants.bcryptSaltRounds ?? 10),
    );
    try {
      return this.userService.createUser(data);
    } catch (error) {
      console.log('error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email);
    const isValidCredentials =
      user && (await bcrypt.compare(password, user.password));

    if (!isValidCredentials)
      throw new UnauthorizedException('Invalid credentials.');

    const payload: JwtPayload = { userId: user.id };
    return this.jwtService.signAsync(payload);
  }
}
