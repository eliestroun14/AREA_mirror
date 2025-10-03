import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import type { Request } from 'express';
import type { AboutJsonResponseDTO } from './aboutJson.dto';

@Injectable()
export class AboutJsonService {
  constructor(private readonly prisma: PrismaService) {}

  async getAboutJson(req: Request): Promise<AboutJsonResponseDTO> {
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
