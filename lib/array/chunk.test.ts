import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';
import {chunk} from './chunk';

describe('array/chunk', () => {
  it('chunks array with a multiple of chunk size into equal chunks', () => {
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const chunks = chunk(array, 5);
    deepStrictEqual(chunks, [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
    ]);
  });

  it('chunks array with non-multiple into non-equal chunks', () => {
    const array = [0, 1, 2, 3, 4, 5, 6];

    const chunks = chunk(array, 5);
    deepStrictEqual(chunks, [
      [0, 1, 2, 3, 4],
      [5, 6],
    ]);
  });

  it('chunks multi-dimensional arrays', () => {
    const array = [
      ['a', 0],
      ['b', 1],
      ['c', 2],
      ['d', 3],
      ['e', 4],
    ];

    const chunks = chunk(array, 2);
    deepStrictEqual(chunks, [
      [
        ['a', 0],
        ['b', 1],
      ],
      [
        ['c', 2],
        ['d', 3],
      ],
      [['e', 4]],
    ]);
  });
});
