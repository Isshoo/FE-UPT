import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  formatDateTime as formatDateTimeTZ,
  formatDate as formatDateTZ,
} from './dateUtils';

export { debounce } from './debounce';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date with timezone support
 * @deprecated Use formatDate from dateUtils instead
 */
export function formatDate(date, format = 'dd MMM yyyy') {
  return formatDateTZ(date, format);
}

/**
 * Format datetime with timezone support
 * @deprecated Use formatDateTime from dateUtils instead
 */
export function formatDateTime(date) {
  return formatDateTimeTZ(date, 'dd MMM yyyy HH:mm');
}

export function formatCurrency(amount) {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
