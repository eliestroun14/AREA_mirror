import { Module } from '@nestjs/common';
import { GoogleDriveOAuth2Controller } from '@root/services/google-drive/oauth2/google-drive.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [GoogleDriveOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class GoogleDriveOAuth2Module {}
