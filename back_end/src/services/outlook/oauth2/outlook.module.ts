import { Module } from '@nestjs/common';
import { OutlookOAuth2Controller } from '@root/services/outlook/oauth2/outlook.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [OutlookOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class OutlookOAuth2Module {}
