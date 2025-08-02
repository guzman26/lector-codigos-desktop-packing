import { format } from 'date-fns';
import { CALIBRE_OPTIONS } from './options';

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

/**
 * Converts a 2-digit calibre code to its human-readable text
 * @param calibreCode - The 2-digit calibre code (e.g., "01", "02", etc.)
 * @returns The human-readable calibre text or the original code if not found
 */
export const getCalibreText = (calibreCode: string): string => {
  if (!calibreCode) return '';
  
  const calibreOption = CALIBRE_OPTIONS.find(option => option.value === calibreCode);
  return calibreOption ? calibreOption.label : calibreCode;
}; 