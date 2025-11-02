export interface OneDriveFileModifiedPollPayload {
  folder_path: string;
}

export interface OneDriveFileModifiedPollComparisonData {
  lastModifiedFileId?: string;
  lastModifiedDateTime?: string;
}
