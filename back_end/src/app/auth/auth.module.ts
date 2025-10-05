import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@app/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { envConstants } from '@config/env';
import { JwtStrategy } from '@app/auth/jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: envConstants.jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
