import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {prefixOverlap} from './prefixOverlap';

describe('string/prefixOverlap', () => {
  it('finds overlapping prefixes (a longer than b)', () => {
    const ol = prefixOverlap('abcd', 'abe');
    strictEqual(ol, 'ab');
  });

  it('finds overlapping prefixes (b longer than a)', () => {
    const ol = prefixOverlap('abe', 'abcd');
    strictEqual(ol, 'ab');
  });

  it('does not find non-overlapping prefixes', () => {
    const ol = prefixOverlap('abcdefg', 'zyxwv');
    strictEqual(ol, '');
  });
});
