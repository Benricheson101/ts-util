export const binarySearch = <T>(haystack: T[], needle: T) => {
  return binarySearchBy(haystack, needle, a => a);
};

export const binarySearchBy = <T, U>(
  haystack: T[],
  needle: U,
  key: (a: T) => U
): number | null => {
  let l = 0;
  let r = haystack.length - 1;
  const middle = () => Math.floor((l + r) / 2);

  while (l <= r) {
    const m = middle();
    if (key(haystack[m]) === needle) {
      return m;
    }

    if (key(haystack[m]) > needle) {
      r = m - 1;
    } else {
      l = m + 1;
    }
  }

  return null;
};
