import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { debounce } from './debounce';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
