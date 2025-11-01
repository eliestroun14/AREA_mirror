import { Module } from '@nestjs/common';
import { MicrosoftOnedriveOAuth2Controller } from '@root/services/microsoft-onedrive/oauth2/microsoft-onedrive.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [MicrosoftOnedriveOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class MicrosoftOnedriveOAuth2Module {}
