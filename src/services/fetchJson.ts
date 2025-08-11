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

export async function fetchJson<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<ApiEnvelope<T> | T> {
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
} 