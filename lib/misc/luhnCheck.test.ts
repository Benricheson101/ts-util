import {strictEqual} from 'node:assert';
import {describe, it} from 'node:test';
import {computeLuhnCheckDigit, isValidLuhn, toLuhn} from './luhnCheck';

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
});
