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
  fetchJson<UnassignedBox[]>(`${API_BASE}/getUnassignedBoxesInPacking
`); 