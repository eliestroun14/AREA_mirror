import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { OneDriveUploadFileActionPayload } from '@root/services/microsoft-onedrive/actions/upload-file/onedrive-upload-file.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class OneDriveUploadFileExecutor extends ActionExecutor<OneDriveUploadFileActionPayload> {
  protected async _execute(
    payload: OneDriveUploadFileActionPayload,
  ): Promise<ActionRunResult> {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const { file_content, filename, folder_path } = payload;

      if (!file_content || !filename) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      // Build the API path
      let apiPath = `/v1.0/me/drive/root:/${filename}:/content`;
      
      if (folder_path && folder_path !== '/' && folder_path.trim() !== '') {
        const cleanPath = folder_path.startsWith('/') ? folder_path.slice(1) : folder_path;
        const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
        apiPath = `/v1.0/me/drive/root:/${cleanPath}/${cleanFilename}:/content`;
      }

      const url = `https://graph.microsoft.com${apiPath}`;

      const contentBuffer = Buffer.from(file_content, 'utf8');

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
        body: contentBuffer,
      });

      if (!response.ok) {
        console.error('Failed to upload file to OneDrive:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const responseData = await response.json();

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [
          { key: 'file_id', value: responseData.id || '' },
          { key: 'file_name', value: responseData.name || filename },
          { key: 'file_size', value: responseData.size?.toString() || '0' },
          { key: 'download_url', value: responseData['@microsoft.graph.downloadUrl'] || '' },
          { key: 'upload_success', value: 'true' },
        ],
      };
    } catch (error) {
      console.error('Error in OneDriveUploadFileExecutor:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
      };
    }
  }
}
