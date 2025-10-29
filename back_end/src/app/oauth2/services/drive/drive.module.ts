import { Module } from '@nestjs/common';
import { DriveOAuth2Controller } from '@app/oauth2/services/drive/drive.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [DriveOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class DriveOAuth2Module {}
