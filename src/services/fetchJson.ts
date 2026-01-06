export interface ApiMeta {
  requestId?: string;
  timestamp?: string;
  // Allow unknown extras
  [key: string]: unknown;
}

export interface ApiEnvelope<T = unknown> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T | null;
  meta?: ApiMeta;
}

export class ApiError extends Error {
  public readonly statusCode?: number;
  public readonly status?: ApiEnvelope['status'];
  public readonly meta?: ApiMeta;

  constructor(message: string, options?: { statusCode?: number; status?: ApiEnvelope['status']; meta?: ApiMeta }) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.status = options?.status;
    this.meta = options?.meta;
  }
}

// Narrowing helper without using 'any'
const hasStatusKey = (value: unknown): value is { status: string } => {
  return typeof value === 'object' && value !== null && 'status' in (value as Record<string, unknown>);
};

export const isApiEnvelope = <T = unknown>(value: unknown): value is ApiEnvelope<T> => hasStatusKey(value);

/**
 * Helper function to check if an ApiEnvelope response is successful
 */
export const isSuccessfulResponse = <T>(response: ApiEnvelope<T> | T): response is ApiEnvelope<T> => {
  return isApiEnvelope(response) && response.status === 'success';
};

/**
 * Helper function to extract data from ApiEnvelope response
 */
export const extractDataFromEnvelope = <T>(response: ApiEnvelope<T> | T): T | null => {
  if (isApiEnvelope(response) && response.status === 'success') {
    return response.data ?? null;
  }
  return null;
};

/**
 * Check if we're offline (no network connection)
 */
function isOffline(): boolean {
  return !navigator.onLine;
}

export async function fetchJson<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<ApiEnvelope<T> | T> {
  // Check if we're offline
  if (isOffline()) {
    // Import offlineQueue dynamically to avoid circular dependencies
    const { offlineQueue } = await import('./offlineQueue');
    
    // Add to offline queue
    const queueId = offlineQueue.add(url, options);
    
    // Throw a special error that indicates the request was queued
    throw new ApiError('Request queued for offline sync', {
      statusCode: 0,
      status: 'error',
      meta: {
        offline: true,
        queueId,
      },
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });

    const statusCode = response.status;
    const text = await response.text();

    // Try to parse JSON when possible
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = text;
    }

    // Non-2xx HTTP status → throw including body
    if (!response.ok) {
      // If server responded with our standardized envelope, surface message
      if (hasStatusKey(parsed)) {
        const env = parsed as ApiEnvelope<unknown>;
        throw new ApiError(env.message || `Request failed ${statusCode}`, {
          statusCode,
          status: env.status,
          meta: env.meta,
        });
      }
      throw new ApiError(`Request failed ${statusCode}: ${typeof parsed === 'string' ? parsed : text}`, { statusCode });
    }

    // If response follows the standardized envelope, handle status
    if (hasStatusKey(parsed)) {
      const env = parsed as ApiEnvelope<T>;
      if (env.status !== 'success') {
        throw new ApiError(env.message || 'Unknown API error', {
          statusCode,
          status: env.status,
          meta: env.meta,
        });
      }
      // Return the full envelope so callers can access data/message/meta as needed
      return env as ApiEnvelope<T>;
    }

    // Fallback: return raw parsed body (for non-standard endpoints)
    return parsed as T;
  } catch (error) {
    // If it's a network error and we're now offline, queue it
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network'))) {
      if (isOffline()) {
        const { offlineQueue } = await import('./offlineQueue');
        const queueId = offlineQueue.add(url, options);
        throw new ApiError('Network error - request queued for offline sync', {
          statusCode: 0,
          status: 'error',
          meta: {
            offline: true,
            queueId,
            originalError: error.message,
          },
        });
      }
    }
    // Re-throw other errors
    throw error;
  }
} 