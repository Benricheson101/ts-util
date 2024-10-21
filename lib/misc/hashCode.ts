/** Jenkins one_at_a_time hash https://en.wikipedia.org/wiki/Jenkins_hash_function */
export const jenkinsHash = (s: string) => {
  let hash = 0;

  for (let i = 0; i < s.length; i++) {
    hash += s.charCodeAt(i);
    hash += hash << 10;
    hash ^= hash >>> 6;
  }

  hash += hash << 3;
  hash ^= hash >>> 11;
  hash += hash << 15;

  return hash;
};

/** Java hashCode() i think */
export const hashCode = (s: string) => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }

  return hash;
};
