import { GithubOnNewIssueTriggerPayload } from '@root/services/github/triggers/on-new-issue/github-on-new-issue.dto';
import { WebhookTrigger } from '@app/webhooks/webhooks.webhook';

export class GithubOnNewIssueWebhookTrigger extends WebhookTrigger {
  static override async hook(
    webhookUrl: string,
    secret: string,
    payload: GithubOnNewIssueTriggerPayload,
    accessToken: string,
  ): Promise<boolean> {
    // Faîte votre requête ici pour lier le service au trigger de l'area.
    // L'objectif de cette requête est d'envoyer la variable 'webhookUrl' au service en passant par son API.
    // Si pour lier votre service vous avez besoin des champs d'input de l'utilisateur, vous les trouverez dans la variable 'payload'.
    // Retournez false si la création du hook a échouée, et true si elle a réussie.
    return false;
  }
}
