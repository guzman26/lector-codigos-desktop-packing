import { useCallback, useEffect, useState } from 'react';
import { fetchAllPallets } from '../services/palletService';
import type { Pallet } from '../types';
import { extractDataFromResponse } from '../utils/extractDataFromResponse';

export const useAllPallets = () => {
  const [data, setData] = useState<Pallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllPallets();
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