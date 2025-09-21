import { Injectable } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';

@Injectable()
export class SpotifyService {
  constructor(private prismaService: PrismaService) {}

  async getPlaylistTracks(playlist_id: string, access_token: string) {
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}?fields=tracks.items(track(id,name,album(name),artist(name)))`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await res.json();
  }

  async saveTrack(track_id: string, trigger_id: number): Promise<boolean> {
    const track = await this.prismaService.pOC_spotify_track.findUnique({
      where: { id: track_id },
    });

    if (track) return false;

    await this.prismaService.pOC_spotify_track.create({
      data: { id: track_id, trigger_id },
    });
    return true;
  }
}
