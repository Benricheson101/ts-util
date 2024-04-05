import {beforeEach, describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {ThrottledQueue} from './throttledQueue';

describe('struct/ThrottledQueue', async () => {
  let q: ThrottledQueue<number>;

  beforeEach(() => {
    q = new ThrottledQueue();
  });

  it('runs immediately on first push', t => {
    t.mock.timers.enable();

    const mockHandleFn = t.mock.fn();
    q.setHandler(mockHandleFn);

    q.push(0);

    strictEqual(mockHandleFn.mock.callCount(), 1);
  });

  it('delays subsequent pushes', t => {
    t.mock.timers.enable();

    const timeout = 500;

    const mockHandleFn = t.mock.fn();
    q.setHandler(mockHandleFn);
    q.setTimeout(timeout);

    q.push(0);
    strictEqual(mockHandleFn.mock.callCount(), 1);

    q.push(1);
    t.mock.timers.tick(timeout);
    strictEqual(mockHandleFn.mock.callCount(), 2);

    q.push(2);
    t.mock.timers.tick(timeout);
    strictEqual(mockHandleFn.mock.callCount(), 3);

    q.push(3);
    t.mock.timers.tick(timeout);
    strictEqual(mockHandleFn.mock.callCount(), 4);

    q.push(4);
    t.mock.timers.tick(timeout);
    strictEqual(mockHandleFn.mock.callCount(), 5);

    strictEqual(q.empty(), true);
  });
});
