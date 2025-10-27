import { ActionRunnerJob } from '@root/runner/zaps/actions/actions.runner.job';
import JobNotFoundError from '@root/runner/errors/job-not-found.error';
import DiscordAction_SendMessage from '@root/runner/services/discord/discord.workflow';

export interface ActionBuilderParams {
  stepId: number;
  accessToken: string | null;
  payload: object;
}

type ActionBuilderFunction = (
  builder: ActionBuilderParams,
) => ActionRunnerJob<any>;

export class ActionsRunnerFactory {
  private registers: Record<string, ActionBuilderFunction> = {
    DiscordAction_SendMessage: (builder: ActionBuilderParams) => {
      return new DiscordAction_SendMessage(builder);
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
  ): ActionRunnerJob<any> {
    if (!(className in this.registers))
      throw new JobNotFoundError(builderParams.stepId, className, 'action');
    return this.registers[className](builderParams);
  }
}
