export const checkBasicRateLimit = async (
  kv: KVNamespace,
  key: string,
  limit = 8,
  windowSeconds = 900,
): Promise<boolean> => {
  const countKey = `ratelimit:${key}`;
  const current = Number((await kv.get(countKey)) || '0');
  if (current >= limit) return false;
  await kv.put(countKey, String(current + 1), { expirationTtl: windowSeconds });
  return true;
};
