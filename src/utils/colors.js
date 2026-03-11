export const urgColor = (d) => {
  if (d === null || d < 0) return 'var(--txt4)';
  if (d <= 1) return '#ef4444';
  if (d <= 3) return '#f59e0b';
  if (d <= 7) return '#3b82f6';
  return '#10b981';
};

export const urgColorHex = (d) => {
  if (d === null || d < 0) return '#334155';
  if (d <= 1) return '#ef4444';
  if (d <= 3) return '#f59e0b';
  if (d <= 7) return '#3b82f6';
  return '#10b981';
};

export const urgLabel = (d) => {
  if (d === null) return 'No date';
  if (d < 0)  return 'Expired';
  if (d === 0) return 'TODAY';
  if (d === 1) return 'Tomorrow';
  return `${d}d left`;
};
