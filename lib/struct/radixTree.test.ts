import {describe, it} from 'node:test';
import {strictEqual, ok} from 'node:assert';

import {RadixTree} from './radixTree';

describe('struct/RadixTree', () => {
  const rt = new RadixTree<string>();

  it('inserts non-overlapping terms at the same depth', () => {
    rt.insert('ben', 'found ben');
    rt.insert('richeson', 'found richeson');

    ok(rt.tree.edges.has('ben'));
    ok(rt.tree.edges.has('richeson'));
  });

  it('inserts overlapping terms with existing prefix', () => {
    rt.insert('benjamin', 'found benjamin');
    rt.insert('bendy', 'found bendy');

    ok(rt.tree.edges.get('ben')!.edges.has('jamin'));
    ok(rt.tree.edges.get('ben')!.edges.has('dy'));
  });

  it('inserts overlapping terms requiring splitting prefix', () => {
    rt.insert('red', 'found red');
    rt.insert('bendy', 'found bendy');

    ok(rt.tree.edges.get('r')!.edges.has('ed'));
    ok(rt.tree.edges.get('r')!.edges.has('icheson'));
  });

  it('searches and finds leaves', () => {
    strictEqual(rt.search('ben'), 'found ben');
    strictEqual(rt.search('benjamin'), 'found benjamin');
    strictEqual(rt.search('richeson'), 'found richeson');
  });

  it('searches and does not find non-leaves', () => {
    strictEqual(rt.search('r'), undefined);
  });
});
