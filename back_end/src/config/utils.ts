import { envConstants } from '@config/env';
import { servicesData } from '@root/prisma/services-data/services.data';
import { triggers } from '@prisma/client';
import { ServiceTrigger } from '@root/prisma/services-data/services.dto';

export const constants = {
  step_types: {
    trigger: 'TRIGGER',
    action: 'ACTION',
  },
  trigger_types: {
    webhook: 'WEBHOOK',
    polling: 'POLLING',
    schedule: 'SCHEDULE',
  },
  execution_status: {
    done: 'DONE',
    in_progress: 'IN PROGRESS',
    failed: 'FAILED',
  },
};

export function callbackOf(service: string): string {
  return `${envConstants.api_base_url}/oauth2/${service}/callback`;
}

export function webhookUrlOf(
  service: string,
  userId: number,
  zapId: number,
  triggerId: number,
): string {
  return `${envConstants.api_base_url}/webhooks/${service}/${userId}/${zapId}/${triggerId}`;
}

export function formateDate(date: Date): string {
  return date.toUTCString();
}

export function getTriggerFromServicesData(
  dbTrigger: triggers,
): ServiceTrigger | null {
  const res = servicesData
    .map((service) => {
      const serviceTriggers = service.triggers.filter((serviceTrigger) => {
        return serviceTrigger.name === dbTrigger.name;
      });
      return serviceTriggers.length > 0 ? serviceTriggers[0] : null;
    })
    .filter((triggers) => {
      return triggers !== null;
    });
  return res.length > 0 ? res[0] : null;
}
