import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, users } from '@prisma/client';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import '@config/env';
import { envConstants } from '@config/env';
import { JwtPayload } from '@app/auth/jwt/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: Prisma.usersCreateInput): Promise<users> {
    data.password = await bcrypt.hash(
      data.password,
      Number(envConstants.bcryptSaltRounds ?? 10),
    );
    try {
      return this.usersService.createUser(data);
    } catch (error) {
      console.log('error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<string> {
    const users = await this.usersService.getUserByEmail(email);
    const isValidCredentials =
      users && (await bcrypt.compare(password, users.password));

    if (!isValidCredentials)
      throw new UnauthorizedException('Invalid credentials.');

    const payload: JwtPayload = { userId: Number(users.id ?? '0') };
    return this.jwtService.signAsync(payload);
  }
}
