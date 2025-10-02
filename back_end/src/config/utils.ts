import { envConstants } from '@config/env';

export function callbackOf(service: string): string {
  return `${envConstants.api_base_url}/oauth2/${service}/callback`;
}

export function formateDate(date: Date): string {
  return date.toUTCString();
}
