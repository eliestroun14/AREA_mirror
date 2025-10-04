import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { triggers } from '@prisma/client';

@Injectable()
export class TriggersService {
  constructor(private prisma: PrismaService) {}

  async getTriggerById(triggerId: number): Promise<triggers | null> {
    return await this.prisma.triggers.findUnique({ where: { id: triggerId } });
  }
}
