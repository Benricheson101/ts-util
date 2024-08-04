export type DelimCaseToCamelCase<
  S extends string,
  Delim extends string,
> = S extends `${infer Fst}${Delim}${infer SndFstLetter}${infer Snd}`
  ? `${Fst}${Uppercase<SndFstLetter>}${DelimCaseToCamelCase<Snd, Delim>}`
  : S;

/**
 * Converts a static string from kebab case to camel case
 */
export type KebabCaseToCamelCase<S extends string> = DelimCaseToCamelCase<
  S,
  '-'
>;

/**
 * Converts a static string from snake case to camel case
 */
export type SnakeCaseToCamelCase<S extends string> = DelimCaseToCamelCase<
  S,
  '_'
>;

export type SnakeToCamel<S extends object> = {
  [key in keyof S as key extends string
    ? SnakeCaseToCamelCase<key>
    : key]: S[key];
};
