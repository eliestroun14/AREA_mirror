import { Controller, Get, Req } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import type { Request } from 'express';

@Controller('about.json')
export class AboutJsonController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getAboutJson(@Req() req: Request) {
    const services = await this.prisma.services.findMany({
      include: {
        actions: true,
        triggers: true,
      },
    });

    const formattedServices = services.map((service) => ({
      name: service.name,
      actions: service.triggers.map((trigger) => ({
        name: trigger.name,
        description: trigger.description,
      })),
      reactions: service.actions.map((action) => ({
        name: action.name,
        description: action.description,
      })),
    }));

    let rawIp = req.ip || req.socket?.remoteAddress || '';
    if (rawIp.startsWith('::ffff:')) {
      rawIp = rawIp.replace(/^::ffff:/, '');
    }

    return {
      client: {
        host: rawIp,
      },
      server: {
        current_time: Math.floor(Date.now() / 1000),
        services: formattedServices,
      },
    };
  }
}
