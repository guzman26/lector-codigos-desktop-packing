// Simplified response data extractor with support for standardized API envelope
export const extractDataFromResponse = <T = unknown>(response: unknown): T[] => {
  if (!response) return [];

  // Handle string body (parse JSON)
  if (typeof response === 'string') {
    try {
      return extractDataFromResponse<T>(JSON.parse(response));
    } catch {
      return [];
    }
  }

  // Direct array
  if (Array.isArray(response)) return response as T[];

  // Handle standardized envelope
  if (typeof response === 'object' && response !== null) {
    const asRecord = response as Record<string, unknown>;
    const isEnvelope = typeof asRecord.status === 'string' && 'data' in asRecord;
    const container = isEnvelope ? (asRecord.data as unknown) : response;

    // If data is directly an array
    if (Array.isArray(container)) return container as T[];

    // If data is an object, try common collection keys
    if (container && typeof container === 'object') {
      const containerRecord = container as Record<string, unknown>;
      const candidateKeys = [
        'items',
        'pallets',
        'boxes',
        'customers',
        'orders',
        'history',
        'movements',
      ];
      for (const key of candidateKeys) {
        const val = containerRecord[key];
        if (Array.isArray(val)) return val as T[];
      }

      // Single object
      return [containerRecord as unknown as T];
    }

    // Legacy common data paths (fallback)
    const legacyDataCandidates: unknown[] = [
      (asRecord.data as Record<string, unknown> | undefined)?.items,
      asRecord.data as unknown,
      asRecord.pallets as unknown,
      asRecord.body as unknown,
      asRecord.items as unknown,
    ];

    for (const data of legacyDataCandidates) {
      if (data) {
        if (typeof data === 'string') {
          return extractDataFromResponse<T>(data);
        }
        if (Array.isArray(data)) {
          return data as T[];
        }
        if (typeof data === 'object') {
          return [data as T];
        }
      }
    }
    // Handle error-like objects
    if ((asRecord as { statusCode?: number }).statusCode && (asRecord as { statusCode: number }).statusCode >= 400) {
      const statusCode = (asRecord as { statusCode: number }).statusCode;
      const message = (asRecord as { message?: string }).message || 'Unknown error';
      throw new Error(`Error ${statusCode}: ${message}`);
    }
  }

  return [];
};
  