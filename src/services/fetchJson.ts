export async function fetchJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    // Provide sane defaults and allow overrides via options
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    // Attempt to read server error body for easier debugging
    const errorBody = await response.text();
    throw new Error(`Request failed ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
} 