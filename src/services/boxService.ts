import { fetchJson } from './fetchJson';  
import { API_BASE } from './index';
import type { UnassignedBox, ConsolidatedResponse, PaginatedData } from '../types';

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

// Process scanned code (BOX or PALLET) - use consolidated /inventory endpoint
export const createBox = async (boxData: unknown): Promise<BoxDetails> => {
  const codigo = String(boxData ?? '');
  const res = await fetchJson<ConsolidatedResponse<PaginatedData<BoxDetails>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'get',
      codigo
    }),
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    const data = res.data as PaginatedData<BoxDetails>;
    const box = data?.items?.[0];
    if (box) {
      return { ...box, code: box.codigo || codigo } as BoxDetails;
    }
  }
  
  throw new Error('Box not found or could not be processed');
};

// Get box by 16-digit code - use consolidated /inventory endpoint
export const getBoxByCode = async (code: string): Promise<BoxDetails> => {
  const res = await fetchJson<ConsolidatedResponse<PaginatedData<BoxDetails>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'get',
      codigo: code
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    const data = res.data as PaginatedData<BoxDetails>;
    const box = data?.items?.[0];
    if (box) {
      return box;
    }
  }
  
  throw new Error('Box not found');
};

export const deleteBox = async (boxCode: string) => {
  const res = await fetchJson<ConsolidatedResponse<{ codigo: string; message: string }>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'delete',
      codigo: boxCode
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res) {
    return { success: res.success };
  }
  
  return { success: false };
};

export const getUnassignedBoxesInPacking = async (limit = 50, lastKey?: string) => {
  const res = await fetchJson<ConsolidatedResponse<PaginatedData<UnassignedBox>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'get',
      ubicacion: 'PACKING',
      filters: {},
      pagination: { limit, lastKey }
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    const data = res.data as PaginatedData<UnassignedBox>;
    return {
      items: data?.items || [],
      count: data?.count || 0,
      nextKey: data?.nextKey || null
    };
  }
  
  return { items: [], count: 0, nextKey: null };
};

// ----------------- NEW: Box Pallet Operations -----------------

interface SuccessWithPalletId { palletId?: string }

/**
 * Creates a single box pallet for an unassigned box
 */
export const createSingleBoxPallet = async (boxCode: string, ubicacion: string) => {
  const res = await fetchJson<ConsolidatedResponse<SuccessWithPalletId>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'create',
      boxCode,
      ubicacion,
      maxBoxes: 1
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    return {
      success: true,
      palletId: res.data?.palletId
    };
  }
  
  return { success: false, message: 'Failed to create pallet' };
};

/**
 * Assigns a box to a compatible existing pallet
 */
export const assignBoxToCompatiblePallet = async (codigo: string) => {
  const res = await fetchJson<ConsolidatedResponse<SuccessWithPalletId>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'assign',
      boxCode: codigo
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    return {
      success: true,
      palletId: res.data?.palletId
    };
  }
  
  return { success: false, message: 'Failed to assign box' };
};
