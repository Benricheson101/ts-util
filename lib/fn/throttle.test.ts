import {strictEqual} from 'node:assert';
import {describe, it} from 'node:test';

import {throttle} from './throttle';

describe('error/throttle', () => {
  it('should throttle repeated calls', t => {
    t.mock.timers.enable({apis: ['setTimeout']});
    const f = t.mock.fn();
    const throttledF = throttle(f, 200);

    throttledF();
    t.mock.timers.tick(100);
    throttledF();
    t.mock.timers.tick(101);
    throttledF();

    strictEqual(f.mock.callCount(), 2);
  });

  it('should return a promise that resolves when called', async t => {
    t.mock.timers.enable({apis: ['setTimeout']});
    const f = t.mock.fn();
    const throttledF = throttle((a: number, b: number) => {
      f();
      return a + b;
    }, 200);

    const promise1 = throttledF(5, 4);
    const promise2 = throttledF(3, 3);

    t.mock.timers.tick(300);

    const result1 = await promise1;
    const result2 = await promise2;

    strictEqual(f.mock.callCount(), 1);
    strictEqual(result1, 9);
    strictEqual(result2, 9);
  });
});
