import { fetchJson, isApiEnvelope } from './fetchJson';  
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

interface ProcessedItemResponse {
  processedItem?: Partial<BoxDetails> & { codigo?: string };
  [key: string]: unknown;
}

// Process scanned code (BOX or PALLET)
export const createBox = async (boxData: unknown): Promise<BoxDetails> => {
  const res = await fetchJson<ProcessedItemResponse>(`${API_BASE}/procesar-escaneo`, {
    method: 'POST',
    body: JSON.stringify({ codigo: boxData, ubicacion: 'PACKING' }),
  });
  // If standardized envelope, unwrap and normalize for UI compatibility
  if (isApiEnvelope<ProcessedItemResponse>(res)) {
    const data = res.data ?? {};
    const processed = (data.processedItem ?? (data as unknown)) as Partial<BoxDetails> & { codigo?: string };
    const code = processed.code ?? processed.codigo ?? String(boxData ?? '');
    return { ...(processed as object), code } as BoxDetails;
  }
  return res as unknown as BoxDetails;
};

// Get box by 16-digit code
export const getBoxByCode = async (code: string): Promise<BoxDetails> => {
  const url = `${API_BASE}/production?codigo=${encodeURIComponent(code)}`;
  const res = await fetchJson<{ box?: BoxDetails }>(url);
  if (isApiEnvelope<{ box?: BoxDetails } | BoxDetails>(res)) {
    const data = res.data as { box?: BoxDetails } | BoxDetails | null | undefined;
    return ((data as { box?: BoxDetails })?.box ?? data) as BoxDetails;
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

interface SuccessWithPalletId { palletId?: string }

/**
 * Creates a single box pallet for an unassigned box
 */
export const createSingleBoxPallet = async (boxCode: string, ubicacion: string) => {
  const res = await fetchJson<SuccessWithPalletId>(`${API_BASE}/createSingleBoxPallet`, {
    method: 'POST',
    body: JSON.stringify({ boxCode, ubicacion }),
  });
  if (isApiEnvelope<SuccessWithPalletId>(res)) {
    const data = res.data ?? {};
    return { success: true, message: res.message, palletId: data.palletId } as {
      success: boolean;
      message?: string;
      palletId?: string;
    };
  }
  return res as { success: boolean; message?: string; palletId?: string };
};

/**
 * Assigns a box to a compatible existing pallet
 */
export const assignBoxToCompatiblePallet = async (codigo: string) => {
  const res = await fetchJson<SuccessWithPalletId>(`${API_BASE}/assignBoxToCompatiblePallet`, {
    method: 'POST',
    body: JSON.stringify({ codigo }),
  });
  if (isApiEnvelope<SuccessWithPalletId>(res)) {
    const data = res.data ?? {};
    return { success: true, message: res.message, palletId: data.palletId } as {
      success: boolean;
      message?: string;
      palletId?: string;
    };
  }
  return res as { success: boolean; message?: string; palletId?: string };
};
