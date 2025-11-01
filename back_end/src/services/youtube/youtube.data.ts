import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { youtubeNewVideoUploadData } from '@root/services/youtube/triggers/new-video-upload/youtube-new-video-upload.data';
import { youtubeNewLikeOnVideoData } from '@root/services/youtube/triggers/new-like-on-video/youtube-new-like-on-video.data'
import { youtubeNewSubscriberData } from './triggers/new-subscriber/youtube-new-subscriber.data';

export const youtubeData: Service = {
  name: constants.services.youtube.name,
  slug: constants.services.youtube.slug,
  serviceColor: '#FF0000',
  iconUrl: '/assets/youtube.png',
  apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
  authType: 'oauth2',
  documentationUrl: 'https://developers.google.com/youtube/v3/docs',
  isActive: true,
  triggers: [
    youtubeNewVideoUploadData,
    youtubeNewLikeOnVideoData,
    youtubeNewSubscriberData,
  ],
  actions: [],
};
