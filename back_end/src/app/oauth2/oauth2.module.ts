import { Module } from '@nestjs/common';
import { Oauth2Controller } from './oauth2.controller';
import { Oauth2Service } from './oauth2.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';
import { GmailStrategy } from '@app/oauth2/services/gmail/gmail.strategy';

@Module({
  controllers: [Oauth2Controller],
  providers: [Oauth2Service, PrismaService, ServicesService, GmailStrategy],
})
export class Oauth2Module {}
