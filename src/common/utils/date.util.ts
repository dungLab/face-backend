import { DateTime } from 'luxon';

export function getCurrentDateFormat(format?: string) {
  return DateTime.fromJSDate(new Date()).toFormat(format);
}
