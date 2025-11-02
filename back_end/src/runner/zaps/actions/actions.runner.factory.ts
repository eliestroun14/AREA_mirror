import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import JobNotFoundError from '@root/runner/errors/job-not-found.error';
import DiscordSendMessageExecutor from '@root/services/discord/actions/send-message/discord-send-message.executor';
import MicrosoftTeamsSendMessageExecutor from '@root/services/microsoft-teams/actions/send-message/microsoft-teams-send-message.executor';
import MicrosoftTeamsSendReactionExecutor from '@root/services/microsoft-teams/actions/send-reaction/microsoft-teams-send-reaction.executor';
import GithubCreateAnIssueExecutor from '@root/services/github/actions/create-an-issue/github-create-an-issue.executor';
import OneDriveUploadFileExecutor from '@root/services/microsoft-onedrive/actions/upload-file/onedrive-upload-file.executor';
import OneDriveCreateFolderExecutor from '@root/services/microsoft-onedrive/actions/create-folder/onedrive-create-folder.executor';
import GoogleCalendarCreateNewEventExecutor from '@root/services/google-calendar/actions/create-new-event/google-calendar-create-new-event.executor';
import { googleCalendarCreateNewEventData } from '@root/services/google-calendar/actions/create-new-event/google-calendar-create-new-event.data';
import { DocumentBuilder } from '@nestjs/swagger';

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
    MicrosoftTeamsSendMessageExecutor: (builder: ActionBuilderParams) => {
      return new MicrosoftTeamsSendMessageExecutor(builder);
    },
    MicrosoftTeamsSendReactionExecutor: (builder: ActionBuilderParams) => {
      return new MicrosoftTeamsSendReactionExecutor(builder);
    },
    GithubCreateAnIssueExecutor: (builder: ActionBuilderParams) => {
      return new GithubCreateAnIssueExecutor(builder);
    },
    OneDriveUploadFileExecutor: (builder: ActionBuilderParams) => {
      return new OneDriveUploadFileExecutor(builder);
    },
    OneDriveCreateFolderExecutor: (builder: ActionBuilderParams) => {
      return new OneDriveCreateFolderExecutor(builder);
    },
    GoogleCalendarCreateNewEventExecutor: (builder: ActionBuilderParams) => {
      return new GoogleCalendarCreateNewEventExecutor(builder);
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
