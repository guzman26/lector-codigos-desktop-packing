import { useState } from 'react';
import { createBox } from '../services/boxService';
import type { BoxDetails } from '../services/boxService';
import { ApiError } from '../services/fetchJson';

type CreatedBox = BoxDetails | Record<string, unknown>;

export interface SubmitResult {
  ok: boolean;
  message?: string;
  queued?: boolean; // True if request was queued for offline sync
}

export const useCreateBox = () => {
  const [data, setData] = useState<CreatedBox | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (boxData: unknown): Promise<SubmitResult> => {
    setLoading(true);
    try {
      const result = await createBox(boxData);
      setData(result as CreatedBox);
      setError(null);
      return { ok: true };
    } catch (err) {
      const e = err as Error;
      
      // Check if this is an offline/queued error
      if (e instanceof ApiError && e.meta?.offline) {
        setError(null); // Don't show error for queued requests
        return { 
          ok: true, // Treat as success since it's queued
          message: 'Código guardado para sincronización cuando vuelva la conexión',
          queued: true,
        };
      }
      
      setError(e);
      return { ok: false, message: e.message };
    } finally {
      setLoading(false);
    }
  };

  return { submit, data, loading, error };
}; 