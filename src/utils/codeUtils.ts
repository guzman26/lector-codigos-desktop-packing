import { format } from 'date-fns';
import { CALIBRE_OPTIONS } from './options';

/**
 * Generates an 11-digit pallet base code.
 * Format: D WW YY S CC F EE
 *   D   Day of week (1-7)           – derived from date
 *   WW  ISO week of year (00-53)    – derived from date
 *   YY  last two digits of year     – derived from date
 *   S   shift (1 digit)             – passed in
 *   CC  calibre (2 digits)          – passed in
 *   F   format (1 digit)            – passed in
 *   EE  company (2 digits)          – passed in
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

  const companyTwoDigits = company.padStart(2, '0');

  return `${day}${week}${year}${shift}${caliber}${formatId}${companyTwoDigits}`;
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

/**
 * Interface for parsed box code information
 */
export interface ParsedBoxInfo {
  calibre: string;
  calibreText: string;
  operario: string;
  numeroCaja: string;
}

/**
 * Parses a 16-digit box code and extracts calibre, operario, and box number
 * Format assumption based on example: 3412506410611016
 * - Calibre: positions 10-11 (0-indexed) -> "06"
 * - Operario: positions 8-9 (0-indexed) -> "10" 
 * - Número de caja: positions 13-15 (0-indexed) -> "016"
 * 
 * @param code - The 16-digit box code
 * @returns Parsed box information or null if code is invalid
 */
export const parseBoxCode = (code: string): ParsedBoxInfo | null => {
  if (!code || code.length !== 16 || !/^\d{16}$/.test(code)) {
    return null;
  }

  // Extract information from specific positions
  const calibreCode = code.substring(10, 12); // positions 10-11
  const operario = code.substring(8, 10);     // positions 8-9
  const numeroCaja = code.substring(13, 16);  // positions 13-15

  return {
    calibre: calibreCode,
    calibreText: getCalibreText(calibreCode),
    operario,
    numeroCaja,
  };
}; 