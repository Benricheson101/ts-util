import {deepStrictEqual} from 'node:assert';
import {describe, it} from 'node:test';
import {try$} from './try';

describe('error/try$', () => {
  it('should return the function result when it does not throw', () => {
    const f = try$((name: string) => `Hello, ${name}!`);

    deepStrictEqual(f('Ben'), ['Hello, Ben!', null]);
    deepStrictEqual(f('Joe'), ['Hello, Joe!', null]);
    deepStrictEqual(f('Bob'), ['Hello, Bob!', null]);
  });

  it('should return the thrown error', () => {
    const f = try$((n: number) => {
      throw n;
    });

    deepStrictEqual(f(0), [null, 0]);
    deepStrictEqual(f(1), [null, 1]);
    deepStrictEqual(f(2), [null, 2]);
  });

  it('should never have both a result and error', () => {
    const f = try$((n: number) => {
      if (n >= 3) {
        throw n;
      }
      return n;
    });

    deepStrictEqual(f(0), [0, null]);
    deepStrictEqual(f(1), [1, null]);
    deepStrictEqual(f(2), [2, null]);
    deepStrictEqual(f(3), [null, 3]);
    deepStrictEqual(f(4), [null, 4]);
  });

  it('should retain `this`', () => {
    const f = try$(function (this: string) {
      return this;
    });

    const g = f.bind('test');

    deepStrictEqual(g(), ['test', null]);
  });
});
