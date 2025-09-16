import { fetchJson, isApiEnvelope } from './fetchJson';
import { API_BASE } from './index';
import type { Pallet, UnassignedBox } from '../types';

/**
 * Domain models – keep them minimal; extend as backend evolves.
 */

export const fetchActivePallets = async (): Promise<Pallet[]> => {
  const res = await fetchJson<{ pallets?: Pallet[]; items?: Pallet[] }>(`${API_BASE}/getActivePallets`);
  if (isApiEnvelope(res)) {
    const data = res.data as { pallets?: Pallet[]; items?: Pallet[] } | null | undefined;
    return (data?.pallets ?? data?.items ?? []) as Pallet[];
  }
  return (res as unknown as Pallet[]) || [];
};

export const fetchAllPallets = async (): Promise<Pallet[]> => {
  const res = await fetchJson<{ pallets?: Pallet[]; items?: Pallet[] }>(`${API_BASE}/getPallets`);
  if (isApiEnvelope(res)) {
    const data = res.data as { pallets?: Pallet[]; items?: Pallet[] } | null | undefined;
    return (data?.pallets ?? data?.items ?? []) as Pallet[];
  }
  return (res as unknown as Pallet[]) || [];
};

export const getUnassignedBoxes = async (): Promise<UnassignedBox[]> => {
  const res = await fetchJson<{ boxes?: UnassignedBox[]; items?: UnassignedBox[] }>(`${API_BASE}/getUnassignedBoxesByLocation?ubicacion=PACKING`);
  if (isApiEnvelope(res)) {
    const data = res.data as { boxes?: UnassignedBox[]; items?: UnassignedBox[] } | null | undefined;
    return (data?.boxes ?? data?.items ?? []) as UnassignedBox[];
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
 * Creates a pallet based on an 11-digit base code (backend appends 3-digit suffix).
 * Example base: 527251021101 → day 5, week 27, year 25, shift 1, calibre 02, formato 1, empresa 01
 */
export const createPallet = async (codigo: string, maxBoxes?: number): Promise<Pallet> => {
  const res = await fetchJson<{ pallet?: Pallet }>(`${API_BASE}/createPallet`, {
    method: 'POST',
    body: JSON.stringify({ codigo, maxBoxes }),
  });
  if (isApiEnvelope<Pallet | { pallet?: Pallet }>(res)) {
    const data = res.data as Pallet | { pallet?: Pallet } | null | undefined;
    return ((data as { pallet?: Pallet })?.pallet ?? data) as Pallet;
  }
  return res as unknown as Pallet;
};
