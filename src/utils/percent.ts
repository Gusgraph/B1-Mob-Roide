export const formatPercent = (value: unknown) => {
  const amount = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(amount)) {
    return 'Unavailable';
  }

  return `${amount.toFixed(2)}%`;
};

