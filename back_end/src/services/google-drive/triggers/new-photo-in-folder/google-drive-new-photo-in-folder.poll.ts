import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  GoogleDriveNewPhotoInFolderPollComparisonData,
  GoogleDriveNewPhotoInFolderPollPayload,
} from '@root/services/google-drive/triggers/new-photo-in-folder/google-drive-new-photo-in-folder.dto';

export class GoogleDriveNewPhotoInFolderPoll extends PollTrigger<
  GoogleDriveNewPhotoInFolderPollPayload,
  GoogleDriveNewPhotoInFolderPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<GoogleDriveNewPhotoInFolderPollComparisonData>
  > {
    const folderId = this.payload.folder;
    const query = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'image/' and trashed=false`);

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
      const comparisonData: GoogleDriveNewPhotoInFolderPollComparisonData = {
        knownPhotosIds: photosInFolder.files.map((file) => {
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
      return !this.lastComparisonData?.knownPhotosIds.includes(value.id);
    });

    if (newFiles.length > 0) {
      const updatedComparisonData: GoogleDriveNewPhotoInFolderPollComparisonData = {
        knownPhotosIds: [
          ...this.lastComparisonData.knownPhotosIds,
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
