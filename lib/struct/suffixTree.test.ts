import {deepStrictEqual} from 'node:assert';
import {describe, it} from 'node:test';

import {SuffixTree} from './suffixTree';

describe('struct/SuffixTree', () => {
  it('finds all children', () => {
    const st = new SuffixTree();
    st.insert('banana');
    deepStrictEqual(st.getChildren('ban'), ['banana']);
    deepStrictEqual(st.getChildren('an'), ['banana']);
    deepStrictEqual(st.getChildren('a'), ['banana']);
  });

  it('inserts terms with common substrings', () => {
    const st = new SuffixTree();
    st.insert('caption');
    st.insert('action');
    st.insert('option');
    st.insert('optional');

    deepStrictEqual(st.getChildren('tion'), [
      'optional',
      'option',
      'action',
      'caption',
    ]);
  });
});
