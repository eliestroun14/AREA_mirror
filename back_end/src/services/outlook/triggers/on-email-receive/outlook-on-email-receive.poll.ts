import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  OutlookOnEmailReceivePollComparisonData,
  OutlookOnEmailReceivePollPayload,
} from '@root/services/outlook/triggers/on-email-receive/outlook-on-email-receive.dto';

export class OutlookOnEmailReceivePoll extends PollTrigger<
  OutlookOnEmailReceivePollPayload,
  OutlookOnEmailReceivePollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<OutlookOnEmailReceivePollComparisonData>
  > {
    const response = await fetch('https://graph.microsoft.com/v1.0/me/messages', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    const emailIds = data.value.map((email: any) => email.id);

    const new_email = emailIds.filter(id => !this.lastComparisonData?.emailIds.includes(id));
    return {
      status: RunnerExecutionStatus.SUCCESS,
      variables: [],
      comparison_data: {
        emailIds: [...this.lastComparisonData?.emailIds || [], new_email[0]],
      },
      is_triggered: new_email.length > 0,
    };
  }
}
