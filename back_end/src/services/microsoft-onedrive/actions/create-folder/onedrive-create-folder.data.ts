import { ServiceAction } from '@root/prisma/services-data/services.dto';

export const oneDriveCreateFolderData: ServiceAction = {
  class_name: 'OneDriveCreateFolderExecutor',
  http_requests: {
    method: 'POST',
    endpoint: '/v1.0/me/drive/root/children',
    description: 'Create a folder in OneDrive',
  },
  name: 'Create Folder',
  description: 'Create a new folder in OneDrive',
  require_connection: true,
  fields: {
    folder_name: {
      key: 'folder_name',
      field_name: 'Folder Name',
      required: true,
      type: 'string',
      default_value: 'New Folder',
      placeholder: 'Enter the name for the new folder',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
    parent_folder_path: {
      key: 'parent_folder_path',
      field_name: 'Parent Folder Path',
      required: false,
      type: 'string',
      default_value: '/',
      placeholder: 'Enter parent folder path (e.g., /Documents) or leave empty for root',
      field_order: 1,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
  },
  variables: [
    { name: 'folder_id' },
    { name: 'folder_name' },
    { name: 'folder_path' },
    { name: 'created_at' },
    { name: 'creation_success' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
