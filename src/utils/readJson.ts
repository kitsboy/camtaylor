const REQUEST_TIMEOUT_MS = 5000;

/** Read a JSON endpoint with a hard timeout so a slow host can never hang the page. */
export async function readJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const relay = () => controller.abort();
  signal.addEventListener('abort', relay);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timer);
    signal.removeEventListener('abort', relay);
  }
}
