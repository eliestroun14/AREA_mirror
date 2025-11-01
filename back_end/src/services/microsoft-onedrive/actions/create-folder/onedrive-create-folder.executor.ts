import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { OneDriveCreateFolderActionPayload } from '@root/services/microsoft-onedrive/actions/create-folder/onedrive-create-folder.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class OneDriveCreateFolderExecutor extends ActionExecutor<OneDriveCreateFolderActionPayload> {
  protected async _execute(
    payload: OneDriveCreateFolderActionPayload,
  ): Promise<ActionRunResult> {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const { folder_name, parent_folder_path } = payload;

      if (!folder_name) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      // Build the API path for creating the folder
      let apiPath = '/v1.0/me/drive/root/children';
      
      // If a parent folder path is specified, navigate to it first
      if (parent_folder_path && parent_folder_path !== '/' && parent_folder_path.trim() !== '') {
        const cleanPath = parent_folder_path.startsWith('/') ? parent_folder_path.slice(1) : parent_folder_path;
        apiPath = `/v1.0/me/drive/root:/${cleanPath}:/children`;
      }

      const url = `https://graph.microsoft.com${apiPath}`;

      const body = {
        name: folder_name,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'rename', // Rename if folder already exists
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error('Failed to create folder in OneDrive:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
        };
      }

      const responseData = await response.json();

      // Build the full folder path
      const fullPath = parent_folder_path && parent_folder_path !== '/' 
        ? `${parent_folder_path}/${responseData.name}`
        : `/${responseData.name}`;

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [
          { key: 'folder_id', value: responseData.id || '' },
          { key: 'folder_name', value: responseData.name || folder_name },
          { key: 'folder_path', value: fullPath },
          { key: 'created_at', value: responseData.createdDateTime || new Date().toISOString() },
          { key: 'creation_success', value: 'true' },
        ],
      };
    } catch (error) {
      console.error('Error in OneDriveCreateFolderExecutor:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
      };
    }
  }
}
