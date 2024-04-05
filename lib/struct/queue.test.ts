import {beforeEach, describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {Queue} from './queue';

describe('struct/Queue', () => {
  let q: Queue<number>;

  beforeEach(() => {
    q = new Queue();
  });

  it('enqueues', () => {
    q.enqueue(0);
    q.enqueue(1);
    strictEqual(q.size(), 2);
  });

  it('dequeues', () => {
    q.enqueue(0);
    q.enqueue(1);
    strictEqual(q.size(), 2);

    strictEqual(q.dequeue(), 0);
    strictEqual(q.dequeue(), 1);
  });
});
