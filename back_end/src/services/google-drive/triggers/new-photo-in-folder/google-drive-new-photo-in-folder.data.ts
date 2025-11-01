import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const googleDriveNewPhotoInFolderData: ServiceTrigger = {
  class_name: 'GoogleDriveNewPhotoInFolderPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'New Photo in your Folder',
  description: 'Trigger this when a new photo is added to your folder.',
  require_connection: true,
  polling_interval: 1000 * 60,
  fields: {
    folder: {
      key: 'folder',
      required: true,
      type: 'string',
      select_options: [],
      field_name: 'Folder ID',
      default_value: '',
      placeholder: 'e.g: 1NxXyuB7BgBssKIoG5LMIN897_k6UzMON',
      field_order: 0,
      validation_rules: {},
      is_active: true
    }
  },
  variables: [
    {
      name: "FileName"
    },
    {
      name: "FileUrl"
    }
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
