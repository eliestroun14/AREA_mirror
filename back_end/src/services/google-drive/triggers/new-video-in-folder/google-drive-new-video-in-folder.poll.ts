import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  GoogleDriveNewVideoInFolderPollComparisonData,
  GoogleDriveNewVideoInFolderPollPayload,
} from '@root/services/google-drive/triggers/new-video-in-folder/google-drive-new-video-in-folder.dto';

export class GoogleDriveNewVideoInFolderPoll extends PollTrigger<
  GoogleDriveNewVideoInFolderPollPayload,
  GoogleDriveNewVideoInFolderPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<GoogleDriveNewVideoInFolderPollComparisonData>
  > {
    const folderId = this.payload.folder;
    const query = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'video/' and trashed=false`);

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

    const photosInFolder = await response.json() as {
      files: {
        id: string;
        name: string;
        mimeType: string;
      }[]
    };

    console.log(photosInFolder);

    if (this.lastComparisonData === null) {
      const comparisonData: GoogleDriveNewVideoInFolderPollComparisonData = {
        knownVideosIds: photosInFolder.files.map((file) => {
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

    const newFiles = photosInFolder.files.filter((value) => {
      return !this.lastComparisonData?.knownVideosIds.includes(value.id);
    });

    if (newFiles.length > 0) {
      const updatedComparisonData: GoogleDriveNewVideoInFolderPollComparisonData = {
        knownVideosIds: [
          ...this.lastComparisonData.knownVideosIds,
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
