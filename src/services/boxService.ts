import { fetchJson } from './fetchJson';  
import { API_BASE } from './index';
import type { UnassignedBox } from '../types';

export interface Box {
  id: string;
  code: string;
  createdAt: string;
}

export interface BoxDetails extends Box {
  status: string;
  palletId?: string;
  [key: string]: unknown;
}

// Process scanned code (BOX or PALLET)
export const createBox = async (boxData: unknown) => {
  const res = await fetchJson<{ processedItem?: any }>(`${API_BASE}/procesar-escaneo`, {
    method: 'POST',
    body: JSON.stringify({ codigo: boxData, ubicacion: 'PACKING' }),
  });
  // If standardized envelope, unwrap and normalize for UI compatibility
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    const data = env.data ?? {};
    const processed = (data as any).processedItem ?? data;
    const code = processed?.code ?? processed?.codigo ?? String(boxData ?? '');
    return { ...processed, code } as any;
  }
  return res as unknown;
};

// Get box by 16-digit code
export const getBoxByCode = async (code: string) => {
  const url = `${API_BASE}/production?codigo=${encodeURIComponent(code)}`;
  const res = await fetchJson<{ box?: BoxDetails }>(url);
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    // Some implementations may return the box directly in data, or under data.box
    return (env.data?.box ?? env.data) as BoxDetails;
  }
  return res as unknown as BoxDetails;
};

export const deleteBox = async (boxCode: string) => {
  await fetchJson<unknown>(`${API_BASE}/admin/deleteBox`, {
    method: 'POST',
    body: JSON.stringify({ codigo: boxCode }),
  });
  // If it didn't throw, consider it successful
  return { success: true } as { success: boolean };
};

export const getUnassignedBoxesInPacking = async (limit = 50, lastKey?: string) => {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (lastKey) params.set('lastKey', lastKey);
  const url = `${API_BASE}/getUnassignedBoxesInPacking${params.toString() ? `?${params.toString()}` : ''}`;
  return fetchJson<{ items: UnassignedBox[]; count: number; nextKey?: string | null }>(url);
};

// ----------------- NEW: Box Pallet Operations -----------------

/**
 * Creates a single box pallet for an unassigned box
 */
export const createSingleBoxPallet = async (boxCode: string, ubicacion: string) => {
  const res = await fetchJson<{ palletId?: string }>(`${API_BASE}/createSingleBoxPallet`, {
    method: 'POST',
    body: JSON.stringify({ boxCode, ubicacion }),
  });
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    return { success: true, message: env.message, palletId: env.data?.palletId } as {
      success: boolean;
      message?: string;
      palletId?: string;
    };
  }
  return res as any;
};

/**
 * Assigns a box to a compatible existing pallet
 */
export const assignBoxToCompatiblePallet = async (codigo: string) => {
  const res = await fetchJson<{ palletId?: string }>(`${API_BASE}/assignBoxToCompatiblePallet`, {
    method: 'POST',
    body: JSON.stringify({ codigo }),
  });
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    return { success: true, message: env.message, palletId: env.data?.palletId } as {
      success: boolean;
      message?: string;
      palletId?: string;
    };
  }
  return res as any;
}; 