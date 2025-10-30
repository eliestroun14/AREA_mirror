import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import { ScheduleTrigger_EveryMinutes } from '@root/runner/services/schedule/schedule.workflow';
import { TeamsTrigger_OnNewMessage } from '@root/runner/services/teams/teams.trigger';
import JobNotFoundError from '@root/runner/errors/job-not-found.error';
import { GithubOnNewRepositoryPoll } from '@root/services/github/triggers/on-new-repository/github-on-new-repository.poll';
import { OutlookOnEmailReceivePoll } from '@root/services/outlook/triggers/on-email-receive/outlook-on-email-receive.poll';

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
    ScheduleTrigger_EveryMinutes: (builder: PollTriggerBuilderParams) => {
      return new ScheduleTrigger_EveryMinutes(builder);
    },
    GithubOnNewRepositoryPoll: (builder: PollTriggerBuilderParams) => {
      return new GithubOnNewRepositoryPoll(builder);
    },
    TeamsTrigger_OnNewMessage: (builder: PollTriggerBuilderParams) => {
      return new TeamsTrigger_OnNewMessage(builder);
    },
    OutlookOnEmailReceivePoll: (builder: PollTriggerBuilderParams) => {
      return new OutlookOnEmailReceivePoll(builder);
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
