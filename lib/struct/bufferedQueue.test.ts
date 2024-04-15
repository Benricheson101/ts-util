import {beforeEach, describe, it} from 'node:test';
import {deepStrictEqual, strictEqual} from 'node:assert';

import {BufferedQueue} from './bufferedQueue';

describe('struct/BufferedQueue', async () => {
  type LogType = 'debug' | 'info' | 'error';
  let bq: BufferedQueue<string, LogType>;

  beforeEach(() => {
    bq = new BufferedQueue();
  });

  it('pushes to the queue', () => {
    bq.push('info', 'info!');

    const eqT = bq.enqueuedTopics();
    deepStrictEqual(eqT, ['info']);
  });

  it('dispatches each topic to a handler fn', t => {
    t.mock.timers.enable();

    const mockHandleFn = t.mock.fn();
    bq.setHandler(mockHandleFn);

    bq.push('info', 'info 1');
    bq.push('info', 'info 2');
    bq.push('info', 'info 3');
    bq.push('error', 'error 1');
    bq.push('error', 'error 2');
    bq.push('debug', 'debug 1');

    t.mock.timers.runAll();

    strictEqual(mockHandleFn.mock.callCount(), 3);

    const args = Object.fromEntries(
      mockHandleFn.mock.calls.map(c => [c.arguments[0], c.arguments[1].length])
    );

    strictEqual(args.info, 3);
    strictEqual(args.error, 2);
    strictEqual(args.debug, 1);
  });

  it('captures handle fn output', async () => {
    bq.setHandler((_, items) => {
      return items.length;
    });

    bq.push('info', 'info 1');
    bq.push('info', 'info 2');
    const infoQ = await bq.push('info', 'info 3');

    deepStrictEqual(infoQ, ['info', 3]);
  });

  it('splits dispatches by timeout', t => {
    t.mock.timers.enable({apis: ['setTimeout']});

    const fn = t.mock.fn();
    bq.setHandler(fn);

    bq.push('info', '1');
    bq.push('info', '2');
    t.mock.timers.tick(300);
    bq.push('info', '3');
    bq.push('info', '4');
    t.mock.timers.tick(200);
    bq.push('info', '5');
    bq.push('info', '6');

    strictEqual(fn.mock.callCount(), 1);
    t.mock.timers.tick(500);
    strictEqual(fn.mock.callCount(), 2);
  });
});
