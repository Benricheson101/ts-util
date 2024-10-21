/** computes a check digit for a number using the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) */
export const computeLuhnCheckDigit = (nr: number) => {
  const s = nr
    .toString()
    .replaceAll(/\D/g, '')
    .split('')
    .toReversed()
    .map((n, i) =>
      (i % 2 ? Number(n) : Number(n) * 2)
        .toString()
        .split('')
        .reduce((a, c) => Number(c) + a, 0)
    )
    .reduce((a, c) => a + c, 0);

  return 10 - ((s % 10) % 10);
};

/** computes a Luhn check digit for a number and appends it */
export const toLuhn = (nr: number) => nr * 10 + computeLuhnCheckDigit(nr);

/** removes the Luhn check digit from a number and returns the number */
export const fromLuhn = (nr: number) => Math.trunc(nr / 10);

/** removes the Luhn check digit from a number and returns the digit */
export const popLuhnCheckDigit = (nr: number) => nr % 10;

/** validates the Luhn check digit of a number */
export const isValidLuhn = (nr: number) =>
  computeLuhnCheckDigit(fromLuhn(nr)) === popLuhnCheckDigit(nr);
