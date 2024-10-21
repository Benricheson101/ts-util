import {strictEqual} from 'node:assert';
import {beforeEach, describe, it} from 'node:test';

import {Stack} from './stack';

describe('struct/Stack', () => {
  let s: Stack<number>;

  beforeEach(() => {
    s = new Stack();
  });

  it('pushes', () => {
    s.push(0);
    s.push(1);
    strictEqual(s.size(), 2);
  });

  it('pops', () => {
    s.push(0);
    s.push(1);
    strictEqual(s.size(), 2);

    strictEqual(s.pop(), 1);
    strictEqual(s.pop(), 0);
  });
});
