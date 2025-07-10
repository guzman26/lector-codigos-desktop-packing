import { useState } from 'react';
import { createSingleBoxPallet } from '../services/boxService';

export const useCreateSingleBoxPallet = () => {
  const [response, setResponse] = useState<{ success: boolean; message?: string; palletId?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (boxCode: string, ubicacion: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createSingleBoxPallet(boxCode, ubicacion);
      setResponse(result);
    } catch (err) {
      setError(err as Error);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResponse(null);
    setError(null);
    setLoading(false);
  };

  return { submit, response, loading, error, reset };
}; 