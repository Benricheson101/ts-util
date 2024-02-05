import {describe, it} from 'node:test';
import {defer} from './defer';
import assert, {fail} from 'node:assert';

describe('defer', () => {
  it('should resolve the promise', async () => {
    const [promise, resolve] = defer();

    assert(promise instanceof Promise);
    resolve(true);
    assert((await promise) === true);
  });

  it('should reject the promise', async () => {
    const [promise, , reject] = defer();
    reject(new Error('explode!'));
    try {
      await promise;
      fail('failed to throw');
    } catch (err) {
      assert(err instanceof Error);
      assert(err.message === 'explode!');
    }
  });
});
