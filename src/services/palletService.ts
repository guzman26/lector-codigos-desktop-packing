import { fetchJson } from './fetchJson';

/**
 * Domain models – keep them minimal; extend as backend evolves.
 */
export interface Pallet {
  id: string;
  code: string;
  createdAt: string;
  // ...other pallet attributes
}

export interface UnassignedBox {
  id: string;
  code: string;
  // ...other box attributes
}

const API_BASE = '/api';

export const fetchActivePallets = () =>
  fetchJson<Pallet[]>(`${API_BASE}/pallets/active`);

export const fetchAllPallets = () =>
  fetchJson<Pallet[]>(`${API_BASE}/pallets`);

export const getUnassignedBoxes = () =>
  fetchJson<UnassignedBox[]>(`${API_BASE}/boxes/unassigned`);

export const closePallet = (code: string) =>
  fetchJson<void>(`${API_BASE}/pallets/${code}/close`, { method: 'POST' });

export const deleteBox = (code: string) =>
  fetchJson<{ success: boolean }>(`${API_BASE}/boxes/${code}`, {
    method: 'DELETE',
  });

export const deletePallet = (code: string) =>
  fetchJson<{ success: boolean }>(`${API_BASE}/pallets/${code}`, {
    method: 'DELETE',
  });

// ----------------- NEW: Create Pallet -----------------
/**
 * Creates a pallet based on a 10-digit base code.
 * Example: 5272510211 → day 5, week 27, year 25, shift 1, caliber 02, format 1, empresa 1
 */
export const createPallet = (codigo: string) =>
  fetchJson<Pallet>(`${API_BASE}/createPallet`, {
    method: 'POST',
    body: JSON.stringify({ codigo }),
  }); 