import { useState } from 'react';
import { createBox } from '../services/boxService';
import type { BoxDetails } from '../services/boxService';

type CreatedBox = BoxDetails | Record<string, unknown>;

export interface SubmitResult {
  ok: boolean;
  message?: string;
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
      setError(e);
      return { ok: false, message: e.message };
    } finally {
      setLoading(false);
    }
  };

  return { submit, data, loading, error };
}; 