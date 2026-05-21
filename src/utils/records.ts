export const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

export const asArray = <T = Record<string, unknown>>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export const firstString = (record: Record<string, unknown>, keys: string[], fallback = 'Unavailable') => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
    if (typeof value === 'number') {
      return String(value);
    }
  }

  return fallback;
};

export const firstNumber = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    const number = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(number)) {
      return number;
    }
  }

  return undefined;
};

