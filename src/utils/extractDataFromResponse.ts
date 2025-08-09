// Simplified response data extractor with support for standardized API envelope
export const extractDataFromResponse = (response: any): any[] => {
  if (!response) return [];

  // Handle string body (parse JSON)
  if (typeof response === 'string') {
    try {
      return extractDataFromResponse(JSON.parse(response));
    } catch {
      return [];
    }
  }

  // Direct array
  if (Array.isArray(response)) return response;

  // Handle standardized envelope
  if (typeof response === 'object' && response !== null) {
    const isEnvelope = typeof response.status === 'string' && 'data' in response;
    const container = isEnvelope ? (response as any).data : response;

    // If data is directly an array
    if (Array.isArray(container)) return container;

    // If data is an object, try common collection keys
    if (container && typeof container === 'object') {
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
        const val = (container as any)[key];
        if (Array.isArray(val)) return val;
      }

      // Single object
      return [container];
    }

    // Legacy common data paths (fallback)
    const paths = [
      (response as any).data?.items,
      (response as any).data,
      (response as any).pallets,
      (response as any).body,
      (response as any).items,
    ];

    for (const data of paths) {
      if (data) {
        if (typeof data === 'string') {
          return extractDataFromResponse(data);
        }
        if (Array.isArray(data)) {
          return data;
        }
        if (typeof data === 'object') {
          return [data];
        }
      }
    }

    // Handle error-like objects
    if ((response as any).statusCode >= 400) {
      throw new Error(
        `Error ${(response as any).statusCode}: ${(response as any).message || 'Unknown error'}`
      );
    }
  }

  return [];
};
  