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
 * Format based on barcode structure: 4272516310211001
 * - Day of week: position 0 (0-indexed) -> "4"
 * - Week of year: positions 1-2 (0-indexed) -> "27"
 * - Year: positions 3-4 (0-indexed) -> "25"
 * - Operario: positions 5-6 (0-indexed) -> "16"
 * - Packer machine: position 7 (0-indexed) -> "3"
 * - Shift: position 8 (0-indexed) -> "1"
 * - Calibre: positions 9-10 (0-indexed) -> "02"
 * - Format: position 11 (0-indexed) -> "1"
 * - Company: position 12 (0-indexed) -> "1"
 * - Número de caja: positions 13-15 (0-indexed) -> "001"
 * 
 * @param code - The 16-digit box code
 * @returns Parsed box information or null if code is invalid
 */
export const parseBoxCode = (code: string): ParsedBoxInfo | null => {
  if (!code || code.length !== 16 || !/^\d{16}$/.test(code)) {
    return null;
  }

  // Extract information from specific positions
  const operario = code.substring(5, 7);      // positions 5-6
  const calibreCode = code.substring(9, 11);  // positions 9-10
  const numeroCaja = code.substring(13, 16);  // positions 13-15

  return {
    calibre: calibreCode,
    calibreText: getCalibreText(calibreCode),
    operario,
    numeroCaja,
  };
}; 