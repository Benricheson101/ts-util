/**
 * Chunks an array into an array of arrays with max length `chunkSize`
 * @param list the array to chunk
 * @param chunkSize the max size of a chunk
 * @returns the chunked array
 */
export const chunk = <T>(list: T[], chunkSize: number): T[][] =>
  list.reduce((acc, curr, i) => {
    const cn = Math.floor(i / chunkSize);
    acc[cn] ||= [];
    acc[cn].push(curr);
    return acc;
  }, [] as T[][]);
