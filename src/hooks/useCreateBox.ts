import { useState } from 'react';
import { createBox } from '../services/boxService';
import type { BoxDetails } from '../services/boxService';

export const useCreateBox = () => {
  const [data, setData] = useState<BoxDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (boxData: unknown) => {
    setLoading(true);
    try {
      const result = await createBox(boxData);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { submit, data, loading, error };
}; 