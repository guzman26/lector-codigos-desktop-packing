import { fetchJson } from './fetchJson';
import { API_BASE } from './index';
import type { Pallet, UnassignedBox } from '../types';

/**
 * Domain models – keep them minimal; extend as backend evolves.
 */

export const fetchActivePallets = async () => {
  const res = await fetchJson<{ pallets?: Pallet[] }>(`${API_BASE}/getActivePallets`);
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    // Support either data.pallets or data.items
    return (env.data?.pallets ?? env.data?.items ?? []) as Pallet[];
  }
  return (res as unknown as Pallet[]) || [];
};

export const fetchAllPallets = async () => {
  const res = await fetchJson<{ pallets?: Pallet[] }>(`${API_BASE}/getPallets`);
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    return (env.data?.pallets ?? env.data?.items ?? []) as Pallet[];
  }
  return (res as unknown as Pallet[]) || [];
};

export const getUnassignedBoxes = async () => {
  const res = await fetchJson<{ boxes?: UnassignedBox[] }>(`${API_BASE}/getUnassignedBoxesByLocation?ubicacion=PACKING`);
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    return (env.data?.boxes ?? env.data?.items ?? []) as UnassignedBox[];
  }
  return (res as unknown as UnassignedBox[]) || [];
};

export const closePallet = (code: string) =>
  fetchJson<void>(`${API_BASE}/closePallet`, { method: 'POST', body: JSON.stringify({ codigo: code }) });

export const deleteBox = (code: string) =>
  fetchJson<{ success: boolean }>(`${API_BASE}/admin/deleteBox`, {
    method: 'POST',
    body: JSON.stringify({ codigo: code }),
  });

export const deletePallet = (code: string) =>
  fetchJson<{ success: boolean }>(`${API_BASE}/admin/deletePallet`, {
    method: 'POST',
    body: JSON.stringify({ codigo: code }),
  });

// ----------------- NEW: Create Pallet -----------------
/**
 * Creates a pallet based on a 10-digit base code.
 * Example: 5272510211 → day 5, week 27, year 25, shift 1, caliber 02, format 1, empresa 1
 */
export const createPallet = async (codigo: string) => {
  const res = await fetchJson<{ pallet?: Pallet }>(`${API_BASE}/createPallet`, {
    method: 'POST',
    body: JSON.stringify({ codigo }),
  });
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    return (env.data?.pallet ?? env.data) as Pallet;
  }
  return res as unknown as Pallet;
}; 