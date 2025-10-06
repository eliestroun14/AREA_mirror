import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { actions } from '@prisma/client';

@Injectable()
export class ActionsService {
  constructor(private prisma: PrismaService) {}

  async getActionById(actionId: number): Promise<actions | null> {
    return await this.prisma.actions.findUnique({ where: { id: actionId } });
  }
}
