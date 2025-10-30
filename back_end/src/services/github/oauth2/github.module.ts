import { Module } from '@nestjs/common';
import { GithubOAuth2Controller } from '@root/services/github/oauth2/github.controller';
import { ConnectionsService } from '@app/users/connections/connections.service';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServicesService } from '@app/services/services.service';

@Module({
  imports: [],
  controllers: [GithubOAuth2Controller],
  providers: [PrismaService, ConnectionsService, ServicesService],
})
export class GithubOAuth2Module {}
