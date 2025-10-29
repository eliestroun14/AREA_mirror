import { Module } from '@nestjs/common';
import { TeamsOAuth2Controller } from '@app/oauth2/services/teams/teams.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [TeamsOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class TeamsOAuth2Module {}
