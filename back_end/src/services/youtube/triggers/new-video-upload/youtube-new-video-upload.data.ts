import { ServiceTrigger } from '@root/prisma/services-data/services.dto';
import { YoutubeNewVideoUploadWebhookTrigger } from '@root/services/youtube/triggers/new-video-upload/youtube-new-video-upload.webhook';
import { YoutubeNewVideoUploadTriggerPayload } from '@root/services/youtube/triggers/new-video-upload/youtube-new-video-upload.dto';

export const youtubeNewVideoUploadData: ServiceTrigger = {
  class_name: '',
  http_requests: null,
  webhook: {
    slug: 'new-video-upload',
    total_received: 0,
    last_received_at: 0,
    hook(
      webhookUrl: string,
      secret: string,
      payload: object,
      accessToken: string,
    ) {
      return YoutubeNewVideoUploadWebhookTrigger.hook(
        webhookUrl,
        secret,
        payload as YoutubeNewVideoUploadTriggerPayload,
        accessToken,
      );
    },
  },
  trigger_type: 'WEBHOOK',
  name: 'New Video From Channel',
  description: 'Be warn when a new video from your favorite channel is upload.',
  require_connection: true,
  polling_interval: 0,
  fields: {
    channel: {
      key: 'channel', // Nom de la variable dans laquelle sera enregistré les données entrées par l'utilisateur
      field_name: 'Enter the Channel ID, e.g. "UCGRODGcsGJDnDebh6uUW_1Q"',
      type: 'string',
      required: true,
      select_options: [],
      default_value: '',
      placeholder: '',
      field_order: 0,
      validation_rules: {},
      is_active: true
    },
  },
  variables: [],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
