import {beforeEach, describe, it} from 'node:test';
import {strictEqual} from 'node:assert';
import {setTimeout} from 'node:timers/promises';

import {BufferedQueue} from './bufferedQueue';

describe('BufferedQueue', async () => {
  type LogType = 'debug' | 'info' | 'error';
  let bq: BufferedQueue<string, LogType>;

  beforeEach(() => {
    bq = new BufferedQueue();
  });

  await it('should push', () => {
    bq.push('info', 'info!');

    const eqT = bq.enqueuedTopics();
    strictEqual(eqT, ['info']);
  });

  it('should dispatch to a handler fn', async t => {
    const handleFn = (_topic: LogType, _items: string[]) => {};
    const mockHandleFn = t.mock.fn(handleFn);

    bq.setHandler(mockHandleFn);

    bq.push('info', 'info 1');
    bq.push('info', 'info 2');
    bq.push('info', 'info 3');
    bq.push('error', 'error 1');
    bq.push('error', 'error 2');
    bq.push('debug', 'debug 1');

    await setTimeout(510); // 10 extra ms because

    const args = Object.fromEntries(
      mockHandleFn.mock.calls.map(c => [c.arguments[0], c.arguments[1].length])
    );

    strictEqual(args.info, 3);
    strictEqual(args.error, 2);
    strictEqual(args.debug, 1);
  });

  it('should capture handle fn output', async () => {
    bq.setHandler((_, items) => {
      return items.length;
    });

    bq.push('info', 'info 1');
    bq.push('info', 'info 2');
    const infoQ = await bq.push('info', 'info 3');

    strictEqual(infoQ, ['info', 3]);
  });

  // TODO: tests for timeout
});
