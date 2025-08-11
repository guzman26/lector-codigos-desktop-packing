import { useState } from 'react';
import { createBox } from '../services/boxService';
import type { BoxDetails } from '../services/boxService';

type CreatedBox = BoxDetails | Record<string, unknown>;

export const useCreateBox = () => {
  const [data, setData] = useState<CreatedBox | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (boxData: unknown) => {
    setLoading(true);
    try {
      const result = await createBox(boxData);
      setData(result as CreatedBox);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { submit, data, loading, error };
}; 