import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import JobNotFoundError from '@root/runner/errors/job-not-found.error';
import {
  TeamsAction_SendMessage,
  TeamsAction_SendReaction,
} from '@root/runner/services/teams/teams.actions';
import DiscordSendMessageExecutor from '@root/services/discord/actions/send-message/discord-send-message.executor';

export interface ActionBuilderParams {
  stepId: number;
  accessToken: string | null;
  payload: object;
}

type ActionBuilderFunction = (
  builder: ActionBuilderParams,
) => ActionExecutor<any>;

export class ActionsRunnerFactory {
  private registers: Record<string, ActionBuilderFunction> = {
    DiscordSendMessageExecutor: (builder: ActionBuilderParams) => {
      return new DiscordSendMessageExecutor(builder);
    },
    TeamsAction_SendMessage: (builder: ActionBuilderParams) => {
      return new TeamsAction_SendMessage(builder);
    },
    TeamsAction_SendReaction: (builder: ActionBuilderParams) => {
      return new TeamsAction_SendReaction(builder);
    },
  };

  /**
   * Build a class of the specified action's class name.
   * @param className The name of the class to build.
   * @param builderParams The parameters required to build the class.
   */
  build(
    className: string,
    builderParams: ActionBuilderParams,
  ): ActionExecutor<any> {
    if (!(className in this.registers))
      throw new JobNotFoundError(builderParams.stepId, className, 'action');
    return this.registers[className](builderParams);
  }
}
