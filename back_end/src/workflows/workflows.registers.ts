import { ActionJob, TriggerJob } from '@root/workflows/workflows.dto';
import GithubTrigger_OnNewRepository from '@root/workflows/services/github/github.workflow';
import DiscordAction_SendMessage from '@root/workflows/services/discord/discord.workflow';

export interface TriggerRegister {
  className: string;
  class: new () => TriggerJob;
  event: string;
  action: string;
}

export const TRIGGERS: Record<string, TriggerRegister> = {
  GithubTrigger_OnNewRepository: {
    className: 'GithubTrigger_OnNewRepository',
    class: GithubTrigger_OnNewRepository,
    event: 'repository',
    action: 'created',
  },
};

export const ACTIONS: Record<string, new () => ActionJob> = {
  DiscordAction_SendMessage: DiscordAction_SendMessage,
};
