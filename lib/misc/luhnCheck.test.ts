import assert, {strictEqual} from 'node:assert';
import {describe, it} from 'node:test';

import {
  computeLuhnCheckDigit,
  fromLuhn,
  isValidLuhn,
  toLuhn,
} from './luhnCheck';

describe('misc/luhnCheck', () => {
  it('should correctly calculate the luhn check digit', () => {
    strictEqual(computeLuhnCheckDigit(1789372997), 4);
  });

  it('should correctly append the luhn check digit', () => {
    strictEqual(toLuhn(1789372997), 17893729974);
  });

  it('should correctly verify the luhn check digit', () => {
    strictEqual(isValidLuhn(17893729974), true);
    strictEqual(isValidLuhn(17893729972), false);
  });

  it('should correctly add and verify many check digits', () => {
    for (let i = 0; i < 100_000; i++) {
      const signed = toLuhn(i);
      assert(isValidLuhn(signed));
      strictEqual(fromLuhn(signed), i);
    }
  });
});
