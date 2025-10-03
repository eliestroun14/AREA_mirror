import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';

@Injectable()
export class SpotifyService {
  constructor(private prismaService: PrismaService) {}
}
