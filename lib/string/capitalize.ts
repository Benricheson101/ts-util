export const capitalize = <S extends string>(word: S): Capitalize<S> =>
  (word.charAt(0).toUpperCase() + word.slice(1)) as Capitalize<S>;
