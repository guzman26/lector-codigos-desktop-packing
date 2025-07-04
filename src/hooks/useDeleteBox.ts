import { useState } from 'react';
import { deleteBox } from '../services/boxService';

export const useDeleteBox = () => {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (code: string) => {
    setLoading(true);
    try {
      const res = await deleteBox(code);
      setSuccess(res.success);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { remove, success, loading, error };
}; 