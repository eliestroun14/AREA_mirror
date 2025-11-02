import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  GoogleDriveNewFileInFolderPollComparisonData,
  GoogleDriveNewFileInFolderPollPayload,
} from '@root/services/google-drive/triggers/new-file-in-folder/google-drive-new-file-in-folder.dto';

export class GoogleDriveNewFileInFolderPoll extends PollTrigger<
  GoogleDriveNewFileInFolderPollPayload,
  GoogleDriveNewFileInFolderPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<GoogleDriveNewFileInFolderPollComparisonData>
  > {

    const folderId = this.payload.folder;
    const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);

    const response = await fetch (
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime)&pageSize=100`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    if (!response.ok) {
      console.log(await response.text())
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: this.lastComparisonData,
        is_triggered: false,
      }
    }

    const filesInFolder = await response.json() as {
      files: {
        id: string;
        name: string;
        mimeType: string;
      }[]
    };

    console.log(filesInFolder);

    if (this.lastComparisonData === null) {
      const comparisonData: GoogleDriveNewFileInFolderPollComparisonData = {
        knownFileIds: filesInFolder.files.map((file) => {
          return file.id;
        })
      };
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: comparisonData,
        is_triggered: false,
      }
    }

    const newFiles = filesInFolder.files.filter((value) => {
      return !this.lastComparisonData?.knownFileIds.includes(value.id);
    });

    if (newFiles.length > 0) {
      const updatedComparisonData: GoogleDriveNewFileInFolderPollComparisonData = {
        knownFileIds: [
          ...this.lastComparisonData.knownFileIds,
          newFiles[0].id,
        ],
      };

      return {
        status: RunnerExecutionStatus.SUCCESS,
        comparison_data: updatedComparisonData,
        variables: [
          {
            key: 'FileName',
            value: newFiles[0].name,
          },
          {
            key: 'FileUrl',
            value: `https://drive.google.com/file/d/${newFiles[0].id}/view`,
          }
        ],
        is_triggered: true,
      };
    } else {
      return {
        status: RunnerExecutionStatus.SUCCESS,
        comparison_data: this.lastComparisonData,
        variables: [],
        is_triggered: false,
      };
    }
  }
}
