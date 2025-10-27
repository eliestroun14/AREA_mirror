import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async getActivitiesForUser(userId: number) {
    const connections = await this.prisma.connections.findMany({
      where: { user_id: userId },
      include: { service: true },
    });

    const connectionActivities = connections.map((c) => ({
      type: 'connection',
      title: `Connection ${c.connection_name || c.account_identifier}`,
      description: `Connection to ${c.service?.name || 'service'}`,
      created_at: new Date(c.created_at).toUTCString(),
      meta: {
        connection_id: c.id,
        service_id: c.service_id,
        service_name: c.service?.name,
        last_used_at: c.last_used_at
          ? new Date(c.last_used_at).toUTCString()
          : null,
      },
    }));

    const zapExecutions = await this.prisma.zap_executions.findMany({
      where: {
        zap: {
          user_id: userId,
        },
      },
      include: {
        zap: true,
      },
    });

    const zapActivities = zapExecutions.map((z) => ({
      type: 'zap_execution',
      title: `Zap ${z.zap?.name || z.zap_id} execution`,
      description: `Status: ${z.status}`,
      created_at: new Date(z.started_at).toUTCString(),
      meta: {
        zap_execution_id: z.id,
        zap_id: z.zap_id,
        zap_name: z.zap?.name,
        duration_ms: z.duration_ms,
        status: z.status,
      },
    }));

    const activities = [...connectionActivities, ...zapActivities].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return activities;
  }
}
