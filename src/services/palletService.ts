import { fetchJson } from './fetchJson';
import { API_BASE } from './index';
import type { Pallet, UnassignedBox, ConsolidatedResponse, PaginatedData } from '../types';

/**
 * Domain models – keep them minimal; extend as backend evolves.
 */

export const fetchActivePallets = async (): Promise<Pallet[]> => {
  const res = await fetchJson<ConsolidatedResponse<PaginatedData<Pallet>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'getActive',
      ubicacion: 'PACKING'
    })
  });
  
  // Handle ConsolidatedResponse format: { success: true, data: { items, count, nextKey } }
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    const data = res.data as PaginatedData<Pallet>;
    return data?.items || [];
  }
  
  return [];
};

export const fetchAllPallets = async (): Promise<Pallet[]> => {
  const res = await fetchJson<ConsolidatedResponse<PaginatedData<Pallet>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'getActive',
      ubicacion: 'PACKING'
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    const data = res.data as PaginatedData<Pallet>;
    return data?.items || [];
  }
  
  return [];
};

export const getUnassignedBoxes = async (): Promise<UnassignedBox[]> => {
  const res = await fetchJson<ConsolidatedResponse<PaginatedData<UnassignedBox>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'get',
      ubicacion: 'PACKING',
      filters: {}
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    const data = res.data as PaginatedData<UnassignedBox>;
    return data?.items || [];
  }
  
  return [];
};

export const closePallet = async (code: string) => {
  const res = await fetchJson<ConsolidatedResponse<Pallet>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'close',
      codigo: code
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    return res.data;
  }
  
  return null;
};

export const deleteBox = async (code: string) => {
  const res = await fetchJson<ConsolidatedResponse<{ codigo: string; message: string }>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'delete',
      codigo: code
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res) {
    return { success: res.success };
  }
  
  return { success: false };
};

export const deletePallet = async (code: string) => {
  const res = await fetchJson<ConsolidatedResponse<{ codigo: string; message: string }>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'delete',
      codigo: code
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res) {
    return { success: res.success };
  }
  
  return { success: false };
};

// ----------------- NEW: Create Pallet -----------------
/**
 * Creates a pallet based on an 11-digit base code (backend appends 3-digit suffix).
 * Example base: 527251021101 → day 5, week 27, year 25, shift 1, calibre 02, formato 1, empresa 01
 */
export const createPallet = async (codigo: string, maxBoxes?: number): Promise<Pallet> => {
  const res = await fetchJson<ConsolidatedResponse<Pallet>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'create',
      codigo,
      ubicacion: 'PACKING',
      maxBoxes
    })
  });
  
  if (res && typeof res === 'object' && 'success' in res && res.success) {
    return res.data;
  }
  
  throw new Error('Failed to create pallet');
};
