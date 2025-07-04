import { format } from 'date-fns';

/**
 * Generates a 10-digit pallet base code.
 * Format: D WW YY S CC F E
 *   D   Day of week (1-7)           – derived from date
 *   WW  ISO week of year (00-53)    – derived from date
 *   YY  last two digits of year     – derived from date
 *   S   shift (1 digit)             – passed in
 *   CC  calibre (2 digits)          – passed in
 *   F   format (1 digit)            – passed in
 *   E   company (1 digit)           – passed in
 */
export const generatePalletCode = (
  date: Date,
  shift: string,
  caliber: string,
  formatId: string,
  company: string
): string => {
  const day   = format(date, 'i');  // ISO day of week 1-7 (Monday=1)
  const week  = format(date, 'II'); // ISO week, zero-padded 2 digits
  const year  = format(date, 'yy'); // last two digits

  return `${day}${week}${year}${shift}${caliber}${formatId}${company}`;
}; 