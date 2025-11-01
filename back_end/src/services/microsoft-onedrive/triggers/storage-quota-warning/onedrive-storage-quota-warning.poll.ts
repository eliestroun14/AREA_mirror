import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  OneDriveStorageQuotaWarningPollComparisonData,
  OneDriveStorageQuotaWarningPollPayload,
} from '@root/services/microsoft-onedrive/triggers/storage-quota-warning/onedrive-storage-quota-warning.dto';

export class OneDriveStorageQuotaWarningPoll extends PollTrigger<
  OneDriveStorageQuotaWarningPollPayload,
  OneDriveStorageQuotaWarningPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  protected async _check(): Promise<
    RunnerCheckResult<OneDriveStorageQuotaWarningPollComparisonData>
  > {
    try {
      if (!this.accessToken) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      const { threshold_percentage } = this.payload;

      if (!threshold_percentage || threshold_percentage < 1 || threshold_percentage > 100) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      const url = 'https://graph.microsoft.com/v1.0/me/drive';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch OneDrive quota information:', response.statusText);
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      const driveData = await response.json();
      const quota = driveData.quota;

      if (!quota || !quota.total) {
        return {
          status: RunnerExecutionStatus.FAILURE,
          variables: [],
          comparison_data: {},
          is_triggered: false,
        };
      }

      const totalBytes = quota.total;
      const usedBytes = quota.used || 0;
      const remainingBytes = totalBytes - usedBytes;
      const usedPercentage = Math.round((usedBytes / totalBytes) * 100);

      // Check if the threshold has been exceeded
      const thresholdExceeded = usedPercentage >= threshold_percentage;

      // Only trigger if:
      // 1. Threshold is exceeded AND
      // 2. We haven't already triggered for this threshold level
      const shouldTrigger = thresholdExceeded && 
                           (!this.lastComparisonData?.lastWarningTriggered || 
                            (this.lastComparisonData?.lastUsedPercentage || 0) < threshold_percentage);

      if (!shouldTrigger) {
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
          comparison_data: { 
            lastWarningTriggered: thresholdExceeded,
            lastUsedPercentage: usedPercentage 
          },
          is_triggered: false,
        };
      }

      // Prepare variables for actions
      const variables = [
        { key: 'used_bytes', value: usedBytes.toString() },
        { key: 'total_bytes', value: totalBytes.toString() },
        { key: 'used_percentage', value: usedPercentage.toString() },
        { key: 'remaining_bytes', value: remainingBytes.toString() },
        { key: 'formatted_used', value: this.formatBytes(usedBytes) },
        { key: 'formatted_total', value: this.formatBytes(totalBytes) },
        { key: 'formatted_remaining', value: this.formatBytes(remainingBytes) },
      ];

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables,
        comparison_data: { 
          lastWarningTriggered: true,
          lastUsedPercentage: usedPercentage 
        },
        is_triggered: true,
      };
    } catch (error) {
      console.error('Error in OneDriveStorageQuotaWarningPoll:', error);
      return {
        status: RunnerExecutionStatus.FAILURE,
        variables: [],
        comparison_data: {},
        is_triggered: false,
      };
    }
  }
}
