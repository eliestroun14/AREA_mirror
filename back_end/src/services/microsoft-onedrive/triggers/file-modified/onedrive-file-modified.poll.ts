import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  OneDriveFileModifiedPollComparisonData,
  OneDriveFileModifiedPollPayload,
} from '@root/services/microsoft-onedrive/triggers/file-modified/onedrive-file-modified.dto';

export class OneDriveFileModifiedPoll extends PollTrigger<
  OneDriveFileModifiedPollPayload,
  OneDriveFileModifiedPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<OneDriveFileModifiedPollComparisonData>
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

      const params = new URLSearchParams();
      params.append('$top', '50'); // Increase limit to get more files for sorting
      
      // Note: Removed date filter for now to avoid API issues
      // if (this.lastExecution) {
      //   const sinceDate = this.lastExecution.toISOString();
      //   params.append('$filter', `lastModifiedDateTime gt ${sinceDate}`);
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

      // Sort files by modification date manually (most recent first)
      const sortedFiles = onlyFiles.sort((a: any, b: any) => {
        const dateA = new Date(a.lastModifiedDateTime).getTime();
        const dateB = new Date(b.lastModifiedDateTime).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

      // Get the most recently modified file
      const latestModifiedFile = sortedFiles[0];
      const currentModifiedDateTime = latestModifiedFile.lastModifiedDateTime;

      // Check if this is a newly modified file
      const isNewlyModified = !this.lastComparisonData?.lastModifiedDateTime || 
                             this.lastComparisonData.lastModifiedDateTime !== currentModifiedDateTime ||
                             this.lastComparisonData.lastModifiedFileId !== latestModifiedFile.id;

      if (!isNewlyModified) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: { 
            lastModifiedFileId: latestModifiedFile.id,
            lastModifiedDateTime: currentModifiedDateTime 
          },
          is_triggered: false,
        };
      }

      // Prepare variables for actions
      const variables = [
        { key: 'file_id', value: latestModifiedFile.id },
        { key: 'file_name', value: latestModifiedFile.name },
        { key: 'file_size', value: latestModifiedFile.size?.toString() || '0' },
        { key: 'file_type', value: latestModifiedFile.file?.mimeType || 'unknown' },
        { key: 'modified_by', value: latestModifiedFile.lastModifiedBy?.user?.displayName || 'Unknown' },
        { key: 'modified_at', value: latestModifiedFile.lastModifiedDateTime },
        { key: 'download_url', value: latestModifiedFile['@microsoft.graph.downloadUrl'] || '' },
      ];

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables,
        comparison_data: { 
          lastModifiedFileId: latestModifiedFile.id,
          lastModifiedDateTime: currentModifiedDateTime 
        },
        is_triggered: true,
      };
    } catch (error) {
      console.error('Error in OneDriveFileModifiedPoll:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: {},
        is_triggered: false,
      };
    }
  }
}
