import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotifyService {
  constructor() {}

  async getPlaylistTracks(playlist_id: number, access_token: string) {
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}`,
      {
        body: JSON.stringify({
          fields: 'tracks.items(track(id,name,album(name),artist(name)))',
        }),
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await res.json();
    console.log(data);
  }
}
