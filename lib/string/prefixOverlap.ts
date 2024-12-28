/** Returns the overlapping portion of two strings starting at the beginning */
export const prefixOverlap = (a: string, b: string): string => {
  let overlap = '';

  let i = 0;
  while (a[i] && a[i] === b[i]) {
    overlap += a[i++];
  }

  return overlap;
};

/**
 * Removes the overlapping prefix of two strings from the first and returns the new string
 * @param a the string that will have its prefix removed
 * @param b a string with the same prefix
 */
export const slicePrefixOverlap = (a: string, b: string) =>
  a.slice(prefixOverlap(a, b).length);
