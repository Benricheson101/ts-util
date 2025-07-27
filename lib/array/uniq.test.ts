import {deepStrictEqual} from 'node:assert';
import {describe, it} from 'node:test';

import {uniq} from './uniq';

describe('array/uniq', () => {
  it('should deduplicate an array', () => {
    const arr = [1, 1, 2, 3, 5, 8];
    const deduped = uniq(arr);

    // FIXME: is order always preserved? can I rely on that for this?
    deepStrictEqual(deduped, [1, 2, 3, 5, 8]);
  });
});
