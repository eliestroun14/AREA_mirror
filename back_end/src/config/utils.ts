import { envConstants } from '@config/env';

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
};

export function callbackOf(service: string): string {
  return `${envConstants.api_base_url}/oauth2/${service}/callback`;
}

export function formateDate(date: Date): string {
  return date.toUTCString();
}
