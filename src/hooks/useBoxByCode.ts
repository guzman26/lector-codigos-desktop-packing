import { useState } from 'react';
import { getBoxByCode } from '../services/boxService';
import type { BoxDetails } from '../services/boxService';

export const useBoxByCode = () => {
  const [data, setData] = useState<BoxDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchByCode = async (code: string) => {
    setLoading(true);
    try {
      const result = await getBoxByCode(code);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchByCode, data, loading, error };
}; 