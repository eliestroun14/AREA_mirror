import { YoutubeNewVideoUploadTriggerPayload } from '@root/services/youtube/triggers/new-video-upload/youtube-new-video-upload.dto';
import { WebhookTrigger } from '@app/webhooks/webhooks.webhook';

export class YoutubeNewVideoUploadWebhookTrigger extends WebhookTrigger {
  static override async hook(
    webhookUrl: string,
    secret: string,
    payload: YoutubeNewVideoUploadTriggerPayload,
    accessToken: string,
  ): Promise<boolean> {
    const subscribeUrl = "https://pubsubhubbub.appspot.com/subscribe";
    const topicUrl = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${payload.channel}`;

    // Données du formulaire
    const data = new URLSearchParams({
      "hub.mode": "subscribe",
      "hub.callback": webhookUrl,
      "hub.lease_seconds": String(60 * 60 * 24 * 365), // 1 an
      "hub.topic": topicUrl,
    });

    try {
      const response = await fetch(subscribeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });

      console.log(response);

      console.log(await response.text());

      return response.status === 202 || response.status === 204 || response.ok;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }
}
