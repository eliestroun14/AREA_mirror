import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { oneDriveNewFileAddedData } from '@root/services/microsoft-onedrive/triggers/new-file-added/onedrive-new-file-added.data';
import { oneDriveFileModifiedData } from '@root/services/microsoft-onedrive/triggers/file-modified/onedrive-file-modified.data';
import { oneDriveStorageQuotaWarningData } from '@root/services/microsoft-onedrive/triggers/storage-quota-warning/onedrive-storage-quota-warning.data';
import { oneDriveUploadFileData } from '@root/services/microsoft-onedrive/actions/upload-file/onedrive-upload-file.data';
import { oneDriveCreateFolderData } from '@root/services/microsoft-onedrive/actions/create-folder/onedrive-create-folder.data';

export const microsoftOnedriveData: Service = {
  name: constants.services.microsoftOnedrive.name,
  slug: constants.services.microsoftOnedrive.slug,
  serviceColor: '#0078d4',
  iconUrl: '/assets/onedrive.png',
  apiBaseUrl: 'https://graph.microsoft.com',
  authType: 'oauth2',
  documentationUrl: 'https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0',
  isActive: true,
  triggers: [
    oneDriveNewFileAddedData,
    oneDriveFileModifiedData,
    oneDriveStorageQuotaWarningData,
  ],
  actions: [
    oneDriveUploadFileData,
    oneDriveCreateFolderData,
  ],
};
