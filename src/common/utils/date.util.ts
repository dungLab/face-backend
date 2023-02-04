import { DateTime } from 'luxon';

export function getCurrentDateFormat(format?: string) {
  return DateTime.fromJSDate(new Date()).toFormat(format);
}

export function getDateFormat(date: Date, format = 'yyyy-MM-dd HH:mm:ss') {
  return DateTime.fromJSDate(date).toFormat(format);
}
