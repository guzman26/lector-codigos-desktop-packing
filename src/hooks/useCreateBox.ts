import { useState } from 'react';
import { createBox } from '../services/boxService';

export const useCreateBox = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (boxData: unknown) => {
    setLoading(true);
    try {
      const result = await createBox(boxData);
      setData(result as any);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { submit, data, loading, error };
}; 