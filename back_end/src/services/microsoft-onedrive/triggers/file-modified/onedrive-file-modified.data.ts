import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const oneDriveFileModifiedData: ServiceTrigger = {
  class_name: 'OneDriveFileModifiedPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'File Modified',
  description: 'Trigger when a file is modified in OneDrive',
  require_connection: true,
  polling_interval: 60000, // 60 seconds
  fields: {
    folder_path: {
      key: 'folder_path',
      field_name: 'Folder Path',
      required: false,
      type: 'string',
      default_value: '/',
      placeholder: 'Enter folder path (e.g., /Documents) or leave empty for root',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {},
    },
  },
  variables: [
    { name: 'file_id' },
    { name: 'file_name' },
    { name: 'file_size' },
    { name: 'file_type' },
    { name: 'modified_by' },
    { name: 'modified_at' },
    { name: 'download_url' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
