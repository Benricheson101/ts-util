import {describe, it} from 'node:test';
import {deepStrictEqual} from 'node:assert';

import {chunkStringAt} from './chunkStringAt';

describe('string/chunkStringAt', () => {
  it('chunks a string at a delimeter (space)', () => {
    const string = 'The quick brown fox jumps over the lazy dog';

    const chunks = chunkStringAt(string, 20, ' ');
    deepStrictEqual(chunks, [
      'The quick brown fox',
      'jumps over the lazy',
      'dog',
    ]);
  });

  it('chunks a string by max length', () => {
    const string = 'abcdefghijklmnopqrstuvwxyz';

    const chunks = chunkStringAt(string, 10, ' ');
    deepStrictEqual(chunks, ['abcdefghij', 'klmnopqrst', 'uvwxyz']);
  });

  it('chunks a string using both a delimeter and max length', () => {
    const string = 'abcdefghijklmnopqrstuvwxyz 0123456789';

    const chunks = chunkStringAt(string, 10, ' ');
    deepStrictEqual(chunks, [
      'abcdefghij',
      'klmnopqrst',
      'uvwxyz',
      '0123456789',
    ]);
  });
});
