import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const oneDriveStorageQuotaWarningData: ServiceTrigger = {
  class_name: 'OneDriveStorageQuotaWarningPoll',
  http_requests: null,
  webhook: null,
  trigger_type: 'POLLING',
  name: 'Storage Quota Warning',
  description: 'Trigger when OneDrive storage usage exceeds a specified percentage',
  require_connection: true,
  polling_interval: 300000, // 5 minutes (storage doesn't change rapidly)
  fields: {
    threshold_percentage: {
      key: 'threshold_percentage',
      field_name: 'Warning Threshold (%)',
      required: true,
      type: 'number',
      default_value: '80',
      placeholder: 'Enter percentage (e.g., 80 for 80%)',
      field_order: 0,
      is_active: true,
      select_options: [],
      validation_rules: {
        min: 1,
        max: 100,
      },
    },
  },
  variables: [
    { name: 'used_bytes' },
    { name: 'total_bytes' },
    { name: 'used_percentage' },
    { name: 'remaining_bytes' },
    { name: 'formatted_used' },
    { name: 'formatted_total' },
    { name: 'formatted_remaining' },
  ],
  is_active: true,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
