import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { ServiceProviderData } from '@app/auth/services';
import { POC_trigger, POC_action } from '@prisma/client';

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}

  async createSpotifyConnection(
    userId: number,
    serviceProfile: ServiceProviderData,
  ): Promise<POC_trigger | null> {
    try {
      return this.prisma.pOC_trigger.create({
        data: {
          access_token: serviceProfile.accessToken,
          user_id: userId,
        },
      });
    } catch (_) {
      return this.prisma.pOC_trigger.findFirst({ where: { user_id: userId } });
    }
  }

  async createGoogleConnection(
    userId: number,
    serviceProfile: ServiceProviderData,
  ): Promise<POC_action | null> {
    try {
      return this.prisma.pOC_action.create({
        data: {
          access_token: serviceProfile.accessToken,
          user_id: userId,
        },
      });
    } catch (_) {
      return this.prisma.pOC_action.findFirst({ where: { user_id: userId } });
    }
  }

  async insertSpotifyTrack(userId: number, trackId: string) {
    const spotify = await this.getSpotifyConnection(userId);

    if (!spotify) return;

    await this.prisma.pOC_spotify_track.create({
      data: {
        trigger_id: spotify.id,
        id: trackId,
      },
    });
  }

  async getSpotifyConnection(userId: number) {
    return this.prisma.pOC_trigger.findFirst({ where: { user_id: userId } });
  }

  async getGoogleConnection(userId: number) {
    return this.prisma.pOC_action.findFirst({ where: { user_id: userId } });
  }
}
