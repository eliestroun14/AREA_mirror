import { Service } from '@root/prisma/services-data/services.dto';
import { discordData } from '@root/services/discord/discord.data';
import { googleCalendarData } from '@root/services/google-calendar/google-calendar.data';
import { twitchData } from '@root/services/twitch/twitch.data';
import { microsoftTeamsData } from '@root/services/microsoft-teams/microsoft-teams.data';
import { microsoftOnedriveData } from '@root/services/microsoft-onedrive/microsoft-onedrive.data';
import { youtubeData } from '@root/services/youtube/youtube.data';
import { googleDriveData } from '@root/services/google-drive/google-drive.data';
import { githubData } from '@root/services/github/github.data';

// N'AJOUTEZ PLUS VOS SERVICES ICI ! REGARDEZ LA DOC !
// N'AJOUTEZ PLUS VOS SERVICES ICI ! REGARDEZ LA DOC !
// N'AJOUTEZ PLUS VOS SERVICES ICI ! REGARDEZ LA DOC !

export const services = {
  discord: { name: 'Discord', slug: 'discord' },
  googleCalendar: { name: 'Calendar', slug: 'calendar' },
  twitch: { name: 'Twitch', slug: 'twitch' },
  youtube: { name: 'Youtube', slug: 'youtube' },
  teams: { name: 'Teams', slug: 'teams' },
  drive: { name: 'Drive', slug: 'drive' },
};

export const servicesData: Service[] = [
  discordData,
  googleCalendarData,
  googleDriveData,
  twitchData,
  microsoftTeamsData,
  microsoftOnedriveData,
  youtubeData,
  githubData,
];
