export const verifyTurnstile = async ({
  token,
  secret,
  remoteIp,
}: {
  token?: string;
  secret?: string;
  remoteIp?: string;
}): Promise<{ ok: boolean; skipped: boolean }> => {
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, skipped: false };

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);
  if (remoteIp) formData.append('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });
  const result = (await response.json().catch(() => null)) as { success?: boolean } | null;

  return { ok: Boolean(result?.success), skipped: false };
};
