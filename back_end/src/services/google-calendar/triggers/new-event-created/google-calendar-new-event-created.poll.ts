import {
  RunnerCheckResult,
  RunnerExecutionStatus,
} from '@root/runner/runner.dto';
import { PollTriggerBuilderParams } from '@root/runner/zaps/triggers/triggers.runner.factory';
import { PollTrigger } from '@root/runner/zaps/triggers/triggers.runner.job';
import {
  GoogleCalendarNewEventCreatedPollComparisonData,
  GoogleCalendarNewEventCreatedPollPayload,
} from '@root/services/google-calendar/triggers/new-event-created/google-calendar-new-event-created.dto';

export class GoogleCalendarNewEventCreatedPoll extends PollTrigger<
  GoogleCalendarNewEventCreatedPollPayload,
  GoogleCalendarNewEventCreatedPollComparisonData
> {
  constructor(params: PollTriggerBuilderParams) {
    super(params);
  }

  protected async _check(): Promise<
    RunnerCheckResult<GoogleCalendarNewEventCreatedPollComparisonData>
  > {
    const response = await fetch (
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=updated&maxResults=50&fields=items(id,summary,status,created,start,end)`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    )

    if (!response.ok) {
      console.log(await response.text())
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: this.lastComparisonData,
        is_triggered: false,
      }
    }

    const eventsInCalendar = await response.json() as {
      items: {
        id: string;
        summary: string;
      }[]
    };

    console.log(eventsInCalendar);

    if (this.lastComparisonData === null) {
      const comparisonData: GoogleCalendarNewEventCreatedPollComparisonData = {
        knownEventsIds: eventsInCalendar.items.map((event) => {
          return event.id;
        })
      };
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
        comparison_data: comparisonData,
        is_triggered: false,
      }
    }

    const newEvents = eventsInCalendar.items.filter((value) => {
      return !this.lastComparisonData?.knownEventsIds.includes(value.id);
    });

    if (newEvents.length > 0) {
      const updatedComparisonData: GoogleCalendarNewEventCreatedPollComparisonData = {
        knownEventsIds: [
          ...this.lastComparisonData.knownEventsIds,
          newEvents[0].id,
        ],
      };

      return {
        status: RunnerExecutionStatus.SUCCESS,
        comparison_data: updatedComparisonData,
        variables: [
          {
            key: 'EventName',
            value: newEvents[0].summary,
          },
          {
            key: 'EventURL',
            value: `https://calendar.google.com/calendar/u/0/r/event/${newEvents[0].id}`,
          }
        ],
        is_triggered: true,
      };
    } else {
      return {
        status: RunnerExecutionStatus.SUCCESS,
        comparison_data: this.lastComparisonData,
        variables: [],
        is_triggered: false,
      };
    }
  }
}
