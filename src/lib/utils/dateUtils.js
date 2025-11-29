// lib/dateUtils.js
import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// Default timezone - bisa di-override per user
const DEFAULT_TIMEZONE = 'Asia/Makassar';

/**
 * Get user's timezone from browser
 */
export function getUserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

/**
 * Convert local datetime to UTC for API
 * @param {Date|string} localDateTime - Local date/time
 * @param {string} timezone - User timezone (default: auto-detect)
 * @returns {Date} UTC Date object
 */
export function toUTC(localDateTime, timezone = getUserTimezone()) {
  const date =
    typeof localDateTime === 'string' ? new Date(localDateTime) : localDateTime;
  return fromZonedTime(date, timezone);
}

/**
 * Convert UTC from API to user local time
 * @param {string} utcDateTime - ISO string from API
 * @param {string} timezone - User timezone (default: auto-detect)
 * @returns {Date} Local Date object
 */
export function fromUTC(utcDateTime, timezone = getUserTimezone()) {
  if (!utcDateTime) return null;
  const date =
    typeof utcDateTime === 'string' ? parseISO(utcDateTime) : utcDateTime;
  return toZonedTime(date, timezone);
}

/**
 * Format datetime for display
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (date-fns format)
 * @param {string} timezone - User timezone
 * @returns {string} Formatted date string
 */
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

/**
 * Format date only (no time)
 */
export function formatDate(date, formatStr = 'dd MMM yyyy') {
  return formatDateTime(date, formatStr);
}

/**
 * Format for datetime-local input (HTML5)
 * @param {Date|string} date - Date to format
 * @returns {string} Format: YYYY-MM-DDTHH:mm
 */
export function toDatetimeLocal(date, timezone = getUserTimezone()) {
  if (!date) return '';

  const zonedDate =
    typeof date === 'string'
      ? fromUTC(date, timezone)
      : toZonedTime(date, timezone);

  return format(zonedDate, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Validate datetime string
 */
export function isValidDateTime(dateString) {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
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

/**
 * Check if date is in the past
 */
export function isPast(date, timezone = getUserTimezone()) {
  if (!date) return false;
  const zonedDate = fromUTC(date, timezone);
  return zonedDate < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date, timezone = getUserTimezone()) {
  if (!date) return false;
  const zonedDate = fromUTC(date, timezone);
  return zonedDate > new Date();
}

/**
 * Get current datetime in ISO format (UTC)
 */
export function nowUTC() {
  return new Date().toISOString();
}

/**
 * Get current datetime in user timezone
 */
export function nowLocal(timezone = getUserTimezone()) {
  return toZonedTime(new Date(), timezone);
}
