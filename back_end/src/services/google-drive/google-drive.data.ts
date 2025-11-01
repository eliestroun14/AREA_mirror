import { constants } from '@config/utils';
import { Service } from '@root/prisma/services-data/services.dto';
import { googleDriveNewFileInFolderData } from './triggers/new-file-in-folder/google-drive-new-file-in-folder.data';
import { googleDriveNewPhotoInFolderData } from './triggers/new-photo-in-folder/google-drive-new-photo-in-folder.data';

export const googleDriveData: Service = {
  name: constants.services.googleDrive.name,
  slug: constants.services.googleDrive.slug,
  serviceColor: '#34A853',
  iconUrl: '/assets/google-drive.png',
  apiBaseUrl: 'https://www.googleapis.com/drive/v3',
  authType: 'oauth2',
  documentationUrl: 'https://developers.google.com/drive/api/v3/reference',
  isActive: true,
  triggers: [
    googleDriveNewFileInFolderData,
    googleDriveNewPhotoInFolderData
  ],
  actions: [],
};
