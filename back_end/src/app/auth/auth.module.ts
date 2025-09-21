import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@app/user/user.module';
import {JwtModule, JwtService} from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import {PassportModule} from "@nestjs/passport";
import { JwtStrategy } from './jwt/jwt.strategy';
import {UserService} from "@app/user/user.service";
import {PrismaService} from "@root/prisma/prisma.service";
import {envConstants} from "@app/auth/constants";
import { DeezerStrategy } from '@app/auth/services/deezer/deezer.strategy';
import { SpotifyStrategy } from '@app/auth/services/spotify/spotify.strategy';
import { GoogleStrategy } from '@app/auth/services/google/google.strategy';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: envConstants.jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, DeezerStrategy, SpotifyStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
