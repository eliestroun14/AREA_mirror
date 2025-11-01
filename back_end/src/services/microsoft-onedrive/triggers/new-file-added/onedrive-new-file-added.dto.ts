export interface OneDriveNewFileAddedPollPayload {
  folder_path: string;
}

export interface OneDriveNewFileAddedPollComparisonData {
  lastFileId?: string;
  lastModified?: string;
}
