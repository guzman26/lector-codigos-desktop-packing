import { useCallback, useEffect, useState } from 'react';
import { fetchActivePallets } from '../services/palletService';
import type { Pallet } from '../services/palletService';

export const useActivePallets = () => {
  const [data, setData] = useState<Pallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchActivePallets());
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Optionally poll every N seconds
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, [load]);

  return { data, loading, error, refresh: load };
}; 