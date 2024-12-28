/** Removes duplicate items from an array using a Set. Note: order is not guaranteed to be preserved */
export const uniq = <T>(arr: T[]): T[] => Array.from(new Set(arr));
