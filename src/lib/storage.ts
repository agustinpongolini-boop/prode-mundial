/**
 * Storage wrapper: uses Vercel KV when available, falls back to in-memory Map.
 * The fallback resets on each cold start but allows the app to work without KV.
 */

const memStore = new Map<string, unknown>();

let kvModule: typeof import('@vercel/kv') | null = null;

async function getKV() {
  if (kvModule) return kvModule;
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  try {
    kvModule = await import('@vercel/kv');
    return kvModule;
  } catch {
    return null;
  }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const mod = await getKV();
  if (mod) {
    return mod.kv.get<T>(key);
  }
  return (memStore.get(key) as T) ?? null;
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  const mod = await getKV();
  if (mod) {
    await mod.kv.set(key, value);
  } else {
    memStore.set(key, value);
  }
}
