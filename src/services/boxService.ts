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


export const createBox = (boxData: unknown) =>
  fetchJson<BoxDetails>(`${API_BASE}/procesar-escaneo`, {
    method: 'POST',
    body: JSON.stringify({codigo: boxData, ubicacion: 'PACKING'}),
  });

export const getBoxByCode = (code: string) =>
  fetchJson<BoxDetails>(`${API_BASE}/${code}`);

export const deleteBox = (boxCode: string) =>
  fetchJson<{ success: boolean }>(`${API_BASE}/${boxCode}`, {
    method: 'DELETE',
  });

export const getUnassignedBoxesInPacking = () =>
  fetchJson<UnassignedBox[]>(`${API_BASE}/getUnassignedBoxesInPacking`);

// ----------------- NEW: Box Pallet Operations -----------------

/**
 * Creates a single box pallet for an unassigned box
 */
export const createSingleBoxPallet = (boxCode: string, ubicacion: string) =>
  fetchJson<{ success: boolean; message?: string; palletId?: string }>(`${API_BASE}/createSingleBoxPallet`, {
    method: 'POST',
    body: JSON.stringify({ boxCode, ubicacion }),
  });

/**
 * Assigns a box to a compatible existing pallet
 */
export const assignBoxToCompatiblePallet = (codigo: string) =>
  fetchJson<{ success: boolean; message?: string; palletId?: string }>(`${API_BASE}/assignBoxToCompatiblePallet`, {
    method: 'POST',
    body: JSON.stringify({ codigo }),
  }); 