// lib/dateUtils.js
import { DEFAULT_TIMEZONE } from '@/config/environment';
import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export function getUserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function toUTC(localDateTime, timezone = getUserTimezone()) {
  const date =
    typeof localDateTime === 'string' ? new Date(localDateTime) : localDateTime;
  return fromZonedTime(date, timezone);
}

export function fromUTC(utcDateTime, timezone = getUserTimezone()) {
  if (!utcDateTime) return null;
  const date =
    typeof utcDateTime === 'string' ? parseISO(utcDateTime) : utcDateTime;
  return toZonedTime(date, timezone);
}

export function formatDateTime(
  date,
  formatStr = 'dd MMM yyyy HH:mm',
  timezone = getUserTimezone()
) {
  if (!date) return '-';

  const zonedDate =
    typeof date === 'string'
      ? fromUTC(date, timezone)
      : toZonedTime(date, timezone);

  return format(zonedDate, formatStr);
}

export function formatDate(date, formatStr = 'dd MMM yyyy') {
  return formatDateTime(date, formatStr);
}

export function toDatetimeLocal(date, timezone = getUserTimezone()) {
  if (!date) return '';

  const zonedDate =
    typeof date === 'string'
      ? fromUTC(date, timezone)
      : toZonedTime(date, timezone);

  return format(zonedDate, "yyyy-MM-dd'T'HH:mm");
}

export function isValidDateTime(dateString) {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

export function getRelativeTime(date, timezone = getUserTimezone()) {
  if (!date) return '';

  const zonedDate = fromUTC(date, timezone);
  const now = new Date();
  const diffMs = now - zonedDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  return formatDate(zonedDate);
}

export function isPast(date, timezone = getUserTimezone()) {
  if (!date) return false;
  const zonedDate = fromUTC(date, timezone);
  return zonedDate < new Date();
}

export function isFuture(date, timezone = getUserTimezone()) {
  if (!date) return false;
  const zonedDate = fromUTC(date, timezone);
  return zonedDate > new Date();
}

export function nowUTC() {
  return new Date().toISOString();
}

export function nowLocal(timezone = getUserTimezone()) {
  return toZonedTime(new Date(), timezone);
}
