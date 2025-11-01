export interface OneDriveStorageQuotaWarningPollPayload {
  threshold_percentage: number;
}

export interface OneDriveStorageQuotaWarningPollComparisonData {
  lastWarningTriggered?: boolean;
  lastUsedPercentage?: number;
}
