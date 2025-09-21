import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ConnectionController } from './connection.controller';
import { SpotifyStrategy } from '@app/auth/services/spotify/spotify.strategy';
import { JwtStrategy } from '@app/auth/jwt/jwt.strategy';

@Module({
  providers: [PrismaService, JwtStrategy, ConnectionService, SpotifyStrategy],
  controllers: [ConnectionController],
})
export class ConnectionModule {}
