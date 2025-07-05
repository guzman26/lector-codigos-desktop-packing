import { useCallback, useEffect, useState } from 'react';
import { fetchActivePallets } from '../services/palletService';
import type { Pallet } from '../types';
import { extractDataFromResponse } from '../utils/extractDataFromResponse';

export const useActivePallets = () => {
  const [data, setData] = useState<Pallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchActivePallets();
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