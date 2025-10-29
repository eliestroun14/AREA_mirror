import { Module } from '@nestjs/common';
import { GoogleCalendarOAuth2Controller } from '@app/oauth2/services/google-calendar/google-calendar.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [GoogleCalendarOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class GoogleCalendarOAuth2Module {}
