import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const oneDriveNewFileAddedData: ServiceTrigger = {
  class_name: 'OneDriveNewFileAddedPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New File Added',
  description: 'Trigger when a new file is added to OneDrive',
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
    { name: 'created_by' },
    { name: 'created_at' },
    { name: 'download_url' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
