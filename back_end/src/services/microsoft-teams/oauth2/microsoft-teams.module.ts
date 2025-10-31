import { Module } from '@nestjs/common';
import { MicrosoftTeamsOAuth2Controller } from '@root/services/microsoft-teams/oauth2/microsoft-teams.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [MicrosoftTeamsOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class MicrosoftTeamsOAuth2Module {}
