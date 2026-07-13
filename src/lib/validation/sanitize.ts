export const sanitizeText = (value: unknown, maxLength = 500): string =>
  String(value ?? '')
    .replace(/\p{Cc}/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

export const normalizePhone = (value: unknown): string =>
  sanitizeText(value, 32).replace(/[^\d+().\-\s]/g, '');

export const normalizeEmail = (value: unknown): string =>
  sanitizeText(value, 254).toLowerCase();
