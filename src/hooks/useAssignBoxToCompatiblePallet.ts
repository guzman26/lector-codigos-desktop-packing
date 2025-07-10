import { useState } from 'react';
import { assignBoxToCompatiblePallet } from '../services/boxService';

export const useAssignBoxToCompatiblePallet = () => {
  const [response, setResponse] = useState<{ success: boolean; message?: string; palletId?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (codigo: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await assignBoxToCompatiblePallet(codigo);
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