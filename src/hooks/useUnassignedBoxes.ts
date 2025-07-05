import { useCallback, useEffect, useState } from 'react';
import { getUnassignedBoxes } from '../services/palletService';
import type { UnassignedBox } from '../types';
import { extractDataFromResponse } from '../utils/extractDataFromResponse';

export const useUnassignedBoxes = () => {
  const [data, setData] = useState<UnassignedBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUnassignedBoxes();
      const extractedData = extractDataFromResponse(data);
      setData(extractedData);
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