/**
 * Design System for Cursor Industrial UI
 * 
 * This file contains reusable Tailwind class compositions for the industrial UI.
 * Use these constants throughout the application to maintain consistency.
 */

// Layout
export const CONTAINER = "p-6 h-full";
export const SECTION = "mb-8";
export const GRID = "grid gap-6";
export const GRID_DASHBOARD = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

// Card styles
export const CARD = "bg-charcoal-800 rounded-lg shadow-lg border border-charcoal-700 p-6";
export const CARD_HEADER = "flex justify-between items-center mb-4 pb-4 border-b border-charcoal-700";
export const CARD_TITLE = "text-xl font-bold text-white tracking-wide";
export const CARD_CONTENT = "space-y-4";

// Typography
export const HEADING_1 = "text-3xl font-bold text-white tracking-wide";
export const HEADING_2 = "text-2xl font-bold text-white tracking-wide";
export const HEADING_3 = "text-xl font-bold text-white tracking-wide";
export const TEXT = "text-base text-gray-300";
export const TEXT_SMALL = "text-sm text-gray-400";
export const TEXT_MONO = "font-mono text-base";
export const TEXT_SUCCESS = "text-green-400";
export const TEXT_ERROR = "text-red-400";
export const TEXT_WARNING = "text-yellow-400";
export const TEXT_INFO = "text-blue-400";

// Form elements
export const FORM = "flex flex-col gap-6 w-full";
export const FORM_GROUP = "flex flex-col gap-2";
export const LABEL = "text-sm uppercase tracking-wide text-gray-300 font-medium";
export const INPUT = "bg-charcoal-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 border border-charcoal-600";
export const SELECT = "bg-charcoal-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 border border-charcoal-600 cursor-pointer";
export const BUTTON = {
  PRIMARY: "bg-accent-500 hover:bg-accent-600 text-charcoal-900 font-bold py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-opacity-50",
  SECONDARY: "bg-charcoal-700 hover:bg-charcoal-600 text-white font-bold py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal-500 focus:ring-opacity-50",
  DANGER: "bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
  DISABLED: "bg-charcoal-600 text-charcoal-400 font-bold py-4 px-6 rounded-lg cursor-not-allowed",
};

// Command input specific
export const COMMAND_INPUT = "p-4 text-lg bg-charcoal-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 font-mono border border-charcoal-600";
export const COMMAND_RESULT = "mt-3 bg-charcoal-800 text-green-400 p-4 font-mono whitespace-pre-wrap rounded-lg border border-charcoal-700";

// Tables
export const TABLE = "min-w-full divide-y divide-charcoal-700";
export const TABLE_HEADER = "bg-charcoal-800 text-left text-xs font-semibold uppercase tracking-wide text-gray-300 py-3 px-4";
export const TABLE_CELL = "py-3 px-4 text-sm text-gray-300 border-b border-charcoal-700";

// Status indicators
export const STATUS = {
  ACTIVE: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300",
  INACTIVE: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400",
  WARNING: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300",
  ERROR: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300",
};

// Global app layout
export const APP_LAYOUT = "min-h-screen bg-charcoal-900 text-white flex flex-col";
export const APP_HEADER = "bg-charcoal-800 border-b border-charcoal-700 py-4 px-6 flex items-center justify-between";
export const APP_CONTENT = "flex-1 overflow-auto p-6";
export const APP_FOOTER = "bg-charcoal-800 border-t border-charcoal-700 py-3 px-6 text-sm text-gray-400";
