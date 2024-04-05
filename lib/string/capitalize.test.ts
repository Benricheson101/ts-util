import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';
import {capitalize} from './capitalize';

describe('string/capitalize', () => {
  it('capitalizes the first word', () => {
    const string = 'hi hello';
    const capitalized = capitalize(string);
    strictEqual(capitalized, 'Hi hello');
  });
});
