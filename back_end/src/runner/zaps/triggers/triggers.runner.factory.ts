import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import JobNotFoundError from '@root/runner/errors/job-not-found.error';
import { GithubOnNewRepositoryPoll } from '@root/services/github/triggers/on-new-repository/github-on-new-repository.poll';
import { TwitchFollowNewChannelPoll } from '@root/services/twitch/triggers/follow-new-channel/twitch-follow-new-channel.poll';
import { TwitchNewFollowerOnYourChannelPoll } from '@root/services/twitch/triggers/new-follower-on-your-channel/twitch-new-follower-on-your-channel.poll';
import { TwitchNewVideoPostedByYouPoll } from '@root/services/twitch/triggers/new-video-posted-by-you/twitch-new-video-posted-by-you.poll';
import { MicrosoftTeamsNewMessagePoll } from '@root/services/microsoft-teams/triggers/new-message/microsoft-teams-new-message.poll';

export interface PollTriggerBuilderParams {
  stepId: number;
  triggerType: string;
  lastExecution: Date | null;
  lastComparisonData: object | null;
  executionInterval: number | null;
  accessToken: string | null;
  payload: object;
}

type TriggerBuilderFunction = (
  builder: PollTriggerBuilderParams,
) => PollTrigger<any, any>;

export class TriggersRunnerFactory {
  private registers: Record<string, TriggerBuilderFunction> = {
    GithubOnNewRepositoryPoll: (builder: PollTriggerBuilderParams) => {
      return new GithubOnNewRepositoryPoll(builder);
    },
    MicrosoftTeamsNewMessagePoll: (builder: PollTriggerBuilderParams) => {
      return new MicrosoftTeamsNewMessagePoll(builder);
    },
    TwitchFollowNewChannelPoll: (builder: PollTriggerBuilderParams) => {
      return new TwitchFollowNewChannelPoll(builder);
    },
    TwitchNewFollowerOnYourChannelPoll: (builder: PollTriggerBuilderParams) => {
      return new TwitchNewFollowerOnYourChannelPoll(builder);
    },
    TwitchNewVideoPostedByYouPoll: (builder: PollTriggerBuilderParams) => {
      return new TwitchNewVideoPostedByYouPoll(builder);
    },
  };

  /**
   * Build a class of the specified trigger's class name.
   * @param className The name of the class to build.
   * @param builderParams The parameters required to build the class.
   */
  build(
    className: string,
    builderParams: PollTriggerBuilderParams,
  ): PollTrigger<any, any> {
    if (!(className in this.registers))
      throw new JobNotFoundError(builderParams.stepId, className, 'trigger');
    return this.registers[className](builderParams);
  }
}
