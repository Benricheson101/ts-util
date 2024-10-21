/** Returns the overlapping portion of two strings starting at the beginning */
export const prefixOverlap = (a: string, b: string): string => {
  let overlap = '';

  let i = 0;
  while (a[i] && a[i] === b[i]) {
    overlap += a[i++];
  }

  return overlap;
};
