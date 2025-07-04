import { useState } from 'react';
import { createPallet } from '../services/palletService';
import type { Pallet } from '../services/palletService';

export const useCreatePallet = () => {
  const [data, setData] = useState<Pallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (codigo: string) => {
    setLoading(true);
    try {
      setData(await createPallet(codigo));
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { submit, data, loading, error };
}; 