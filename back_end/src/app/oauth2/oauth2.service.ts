import { Injectable, NotFoundException } from '@nestjs/common';
import { OAuth2Provider } from '@app/oauth2/oauth2.dto';
import { ServicesService } from '@app/services/services.service';
import { PrismaService } from '@root/prisma/prisma.service';

@Injectable()
export class Oauth2Service {
  constructor(
    private prisma: PrismaService,
    private servicesService: ServicesService,
  ) {}
}
