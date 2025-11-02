import { ActionExecutor } from '@root/runner/zaps/actions/actions.runner.job';
import { ActionRunResult } from '@root/runner/zaps/actions/actions.runner.dto';
import { GoogleCalendarCreateNewEventActionPayload } from '@root/services/google-calendar/actions/create-new-event/google-calendar-create-new-event.dto';
import { RunnerExecutionStatus } from '@root/runner/runner.dto';

export default class GoogleCalendarCreateNewEventExecutor extends ActionExecutor<GoogleCalendarCreateNewEventActionPayload> {
  protected async _execute(
    payload: GoogleCalendarCreateNewEventActionPayload,
  ): Promise<ActionRunResult> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: payload.summary,
            description: payload.description,
            start: {
              dateTime: payload.start,
              timeZone: 'Europe/Paris',
            },
            end: {
              dateTime: payload.end,
              timeZone: 'Europe/Paris',
            },
          }),
        }
      );

      if (!response.ok) {
        console.log(await response.text());
        return {
          status: RunnerExecutionStatus.SUCCESS,
          variables: [],
        };
      }

      const createdEvent = await response.json() as {
        id: string;
        summary: string;
      };

      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [
          { key: 'EventId',
            value: createdEvent.id
          },
          { key: 'EventName',
            value: createdEvent.summary
          },
          { key: 'EventURL',
            value: `https://calendar.google.com/calendar/u/0/r/event/${createdEvent.id}`
          },
        ],
      };

    } catch (err) {
      console.error(err);
      return {
        status: RunnerExecutionStatus.SUCCESS,
        variables: [],
      };
    }
  }
}
