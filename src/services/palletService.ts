import { fetchJson, isApiEnvelope } from './fetchJson';
import { API_BASE } from './index';
import type { Pallet, UnassignedBox, ApiEnvelope, PaginatedData } from '../types';

/**
 * Domain models – keep them minimal; extend as backend evolves.
 */

export const fetchActivePallets = async (): Promise<Pallet[]> => {
  const res = await fetchJson<ApiEnvelope<PaginatedData<Pallet>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'get',
      estado: 'open',
      ubicacion: 'PACKING'
    })
  });
  
  // Handle ApiEnvelope format: { status: 'success', data: { items, count, nextKey } }
  if (isApiEnvelope(res) && res.status === 'success' && res.data) {
    const data = res.data as PaginatedData<Pallet>;
    return data?.items || [];
  }
  
  return [];
};

export const fetchAllPallets = async (): Promise<Pallet[]> => {
  const res = await fetchJson<ApiEnvelope<PaginatedData<Pallet>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'get',
      estado: 'open',
      ubicacion: 'PACKING'
    })
  });
  
  if (isApiEnvelope(res) && res.status === 'success' && res.data) {
    const data = res.data as PaginatedData<Pallet>;
    return data?.items || [];
  }
  
  return [];
};

export const getUnassignedBoxes = async (): Promise<UnassignedBox[]> => {
  const res = await fetchJson<ApiEnvelope<PaginatedData<UnassignedBox>>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'get',
      ubicacion: 'PACKING',
      filters: {}
    })
  });
  
  if (isApiEnvelope(res) && res.status === 'success' && res.data) {
    const data = res.data as PaginatedData<UnassignedBox>;
    return data?.items || [];
  }
  
  return [];
};

export const closePallet = async (code: string) => {
  const res = await fetchJson<ApiEnvelope<Pallet>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'close',
      codigo: code
    })
  });
  
  if (isApiEnvelope(res) && res.status === 'success' && res.data) {
    return res.data;
  }
  
  return null;
};

export const deleteBox = async (code: string) => {
  const res = await fetchJson<ApiEnvelope<{ codigo: string; message: string }>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'box',
      action: 'delete',
      codigo: code
    })
  });
  
  if (isApiEnvelope(res)) {
    return { success: res.status === 'success' };
  }
  
  return { success: false };
};

export const deletePallet = async (code: string) => {
  const res = await fetchJson<ApiEnvelope<{ codigo: string; message: string }>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'delete',
      codigo: code
    })
  });
  
  if (isApiEnvelope(res)) {
    return { success: res.status === 'success' };
  }
  
  return { success: false };
};

// ----------------- NEW: Create Pallet -----------------
/**
 * Creates a pallet based on an 11-digit base code (backend appends 3-digit suffix).
 * Example base: 527251021101 → day 5, week 27, year 25, shift 1, calibre 02, formato 1, empresa 01
 * @param horarios Array de hasta 3 horarios/turnos permitidos para este pallet
 */
export const createPallet = async (codigo: string, maxBoxes?: number, horarios?: string[]): Promise<Pallet> => {
  const res = await fetchJson<ApiEnvelope<Pallet>>(`${API_BASE}/inventory`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'pallet',
      action: 'create',
      codigo,
      ubicacion: 'PACKING',
      maxBoxes,
      horarios: horarios || []
    })
  });
  
  if (isApiEnvelope(res) && res.status === 'success' && res.data) {
    return res.data;
  }
  
  throw new Error('Failed to create pallet');
};
