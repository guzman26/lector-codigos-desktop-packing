import { useState } from 'react';

/**
 * Provides real-time data for the Dashboard. In production this would
 * subscribe to a WebSocket or polling service.
 */

interface DashboardData {
  codeInput: { latestCode: string; history: string[] };
  activePallets: unknown[];
  boxesWithoutPallet: unknown[];
  systemInfo: Record<string, unknown>;
}

export const useDashboardData = (): DashboardData => {
  const [data] = useState<DashboardData>({
    codeInput: { latestCode: '', history: [] },
    activePallets: [],
    boxesWithoutPallet: [],
    systemInfo: {},
  });

  return data;
}; 