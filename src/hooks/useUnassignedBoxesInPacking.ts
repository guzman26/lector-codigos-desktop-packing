import { useCallback, useEffect, useState } from 'react';
import { getUnassignedBoxesInPacking } from '../services/boxService';
import type { UnassignedBox } from '../services/boxService';

export const useUnassignedBoxesInPacking = () => {
  const [data, setData] = useState<UnassignedBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getUnassignedBoxesInPacking());
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}; 