import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@root/prisma/prisma.service';
import { POC_trigger } from '@prisma/client';
import { SpotifyService } from '@app/auth/services/spotify/spotify.service';
import { SpotifyTrack } from '@app/jobs/job.dto';
import { GoogleService } from '@app/auth/services/google/google.service';

@Injectable()
export class JobService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private spotify: SpotifyService,
    private google: GoogleService,
  ) {}

  onModuleInit() {
    const prismaService = this.prisma;
    const spotifyService = this.spotify;
    const googleService = this.google;

    console.log('Running tasks triggers...');

    const runTask = async () => {
      const triggers: POC_trigger[] =
        await prismaService.pOC_trigger.findMany();

      for (const trigger of triggers) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await spotifyService.getPlaylistTracks(
          '5vdePGT6PMjYM64CEh1J8T',
          trigger.access_token,
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const tracks: SpotifyTrack[] = data.tracks?.items ?? [];
        for (const track of tracks) {
          const isSaved = await spotifyService.saveTrack(track.id, trigger.id);

          if (!isSaved) {
            const access_token = await googleService.getAccessTokenOf(
              trigger.user_id,
            );
            if (!access_token) {
              console.log(
                `No access token found for user ${trigger.user_id} !`,
              );
              break;
            }
            const isSent = await googleService.sendEmail(
              'New spotify track',
              'jeannot.nathan53@gmail.com',
              'A new track has been added to the playlist.',
              access_token,
            );
            if (isSent) console.log('Message sent !');
            else console.log('FAILURE');
          }
        }
      }
      console.log('Background task running...');
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    runTask().then(() => setInterval(runTask, 60000));
  }
}
