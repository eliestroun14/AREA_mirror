import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from '@app/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import '@config/env';
import { secretConstants } from '@app/auth/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await bcrypt.hash(
      data.password,
      Number(secretConstants.bcryptSaltRounds ?? 10),
    );
    try {
      return this.userService.createUser(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
      }
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email);
    const isValidCredentials =
      user && (await bcrypt.compare(password, user.password));

    if (!isValidCredentials)
      throw new UnauthorizedException('Invalid credentials.');

    const payload = { sub: user.id };
    return this.jwtService.signAsync(payload);
  }
}
