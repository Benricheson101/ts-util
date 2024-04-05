import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {binarySearch, binarySearchBy} from './binarySearch';

describe('algo/binarySearch', () => {
  it('should find the value', () => {
    const hs = [0, 2, 4, 6, 7, 8, 10];
    const idx7 = binarySearch(hs, 7);
    strictEqual(idx7, 4);
  });

  it('should not find nonexistant value', () => {
    const hs = [0, 2, 4, 6, 8, 10];
    const idx7 = binarySearch(hs, 7);
    strictEqual(idx7, null);
  });
});

describe('algo/binarySearchBy', () => {
  it('should find the object value', () => {
    const hs = [{a: 0}, {a: 2}, {a: 3}, {a: 4}];
    const idx7 = binarySearchBy(hs, 2, v => v.a);
    strictEqual(idx7, 1);
  });

  it('should not find nonexistant value', () => {
    const hs = [{a: 0}, {a: 2}, {a: 3}, {a: 4}];
    const idx7 = binarySearchBy(hs, 1, v => v.a);
    strictEqual(idx7, null);
  });
});
