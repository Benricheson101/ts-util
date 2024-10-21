import {strictEqual} from 'node:assert';
import {describe, it} from 'node:test';

import {debounce} from './debounce';

describe('error/debounce', () => {
  it('should debounce repeated calls', t => {
    t.mock.timers.enable({apis: ['setTimeout']});
    const f = t.mock.fn();
    const debouncedF = debounce(f, 200);

    debouncedF();
    t.mock.timers.tick(100);
    debouncedF();
    t.mock.timers.tick(100);
    debouncedF();
    t.mock.timers.tick(200);

    strictEqual(f.mock.callCount(), 1);
  });

  it('should return a promise that resolves when called', async t => {
    t.mock.timers.enable({apis: ['setTimeout']});
    const f = t.mock.fn();
    const debouncedF = debounce((a: number, b: number) => {
      f();
      return a + b;
    }, 200);

    const promise1 = debouncedF(5, 4);
    const promise2 = debouncedF(3, 3);

    t.mock.timers.tick(300);

    const result1 = await promise1;
    const result2 = await promise2;

    strictEqual(f.mock.callCount(), 1);
    strictEqual(result1, 6);
    strictEqual(result2, 6);
  });
});
