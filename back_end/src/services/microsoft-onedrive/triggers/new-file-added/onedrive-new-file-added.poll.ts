import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  OneDriveNewFileAddedPollComparisonData,
  OneDriveNewFileAddedPollPayload,
} from '@root/services/microsoft-onedrive/triggers/new-file-added/onedrive-new-file-added.dto';

export class OneDriveNewFileAddedPoll extends PollTrigger<
  OneDriveNewFileAddedPollPayload,
  OneDriveNewFileAddedPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<OneDriveNewFileAddedPollComparisonData>
  > {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      const { folder_path } = this.payload;
      let apiPath = '/v1.0/me/drive/root/children';
      
      if (folder_path && folder_path !== '/' && folder_path.trim() !== '') {
        let cleanPath = folder_path.trim();
        if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
        if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);
        if (cleanPath) {
          const pathSegments = cleanPath.split('/').map(segment => encodeURIComponent(segment));
          const encodedPath = pathSegments.join('/');
          apiPath = `/v1.0/me/drive/root:/${encodedPath}:/children`;
        }
      }

      // Build the URL with parameters
      const params = new URLSearchParams();
      params.append('$top', '50'); // Increase limit to get more files for sorting
      
      // Note: Removed date filter for now to avoid API issues
      // if (this.lastExecution) {
      //   const sinceDate = this.lastExecution.toISOString();
      //   params.append('$filter', `createdDateTime gt ${sinceDate}`);
      // }

      const url = `https://graph.microsoft.com${apiPath}?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch OneDrive files:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      const data = await response.json();
      const files = data.value || [];
      
      // Filter only files (not folders)
      const onlyFiles = files.filter((item: any) => item.file);

      if (onlyFiles.length === 0) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: this.lastComparisonData || {},
          is_triggered: false,
        };
      }

      // Sort files by creation date manually (most recent first)
      const sortedFiles = onlyFiles.sort((a: any, b: any) => {
        const dateA = new Date(a.createdDateTime).getTime();
        const dateB = new Date(b.createdDateTime).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      // Get the most recently created file
      const latestFile = sortedFiles[0];
      const latestFileId = latestFile.id;

      // Check if this is a new file
      const isNewFile = !this.lastComparisonData?.lastFileId || 
                       this.lastComparisonData.lastFileId !== latestFileId;

      if (!isNewFile) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: { lastFileId: latestFileId, lastModified: latestFile.lastModifiedDateTime },
          is_triggered: false,
        };
      }

      // Prepare variables for actions
      const variables = [
        { key: 'file_id', value: latestFile.id },
        { key: 'file_name', value: latestFile.name },
        { key: 'file_size', value: latestFile.size?.toString() || '0' },
        { key: 'file_type', value: latestFile.file?.mimeType || 'unknown' },
        { key: 'created_by', value: latestFile.createdBy?.user?.displayName || 'Unknown' },
        { key: 'created_at', value: latestFile.createdDateTime },
        { key: 'download_url', value: latestFile['@microsoft.graph.downloadUrl'] || '' },
      ];

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables,
        comparison_data: { lastFileId: latestFileId, lastModified: latestFile.lastModifiedDateTime },
        is_triggered: true,
      };
    } catch (error) {
      console.error('Error in OneDriveNewFileAddedPoll:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: {},
        is_triggered: false,
      };
    }
  }
}
