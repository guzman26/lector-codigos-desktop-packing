import { fetchJson } from './fetchJson';

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

export type UnassignedBox = Box;

const API_BASE = '/api/boxes';

export const createBox = (boxData: unknown) =>
  fetchJson<BoxDetails>(API_BASE, {
    method: 'POST',
    body: JSON.stringify(boxData),
  });

export const getBoxByCode = (code: string) =>
  fetchJson<BoxDetails>(`${API_BASE}/${code}`);

export const deleteBox = (boxCode: string) =>
  fetchJson<{ success: boolean }>(`${API_BASE}/${boxCode}`, {
    method: 'DELETE',
  });

export const getUnassignedBoxesInPacking = () =>
  fetchJson<UnassignedBox[]>(`${API_BASE}/unassigned?section=packing`); 