import {deepStrictEqual, ok, strictEqual} from 'node:assert';
import {describe, it} from 'node:test';

import {RadixTree} from './radixTree';

describe('struct/RadixTree', () => {
  it('inserts non-overlapping terms at the same depth', () => {
    const rt = new RadixTree();
    rt.insert('ben').insert('richeson');

    ok(rt.tree.edges.has('ben'));
    ok(rt.tree.edges.has('richeson'));
  });

  it('inserts overlapping terms with existing prefix', () => {
    const rt = new RadixTree();
    rt.insert('benjamin').insert('bendy');

    ok(rt.tree.edges.get('ben')!.edges.has('jamin'));
    ok(rt.tree.edges.get('ben')!.edges.has('dy'));
  });

  it('inserts overlapping terms requiring splitting prefix', () => {
    const rt = new RadixTree();
    rt.insert('richeson').insert('red').insert('bendy');

    ok(rt.tree.edges.get('r')!.edges.has('ed'));
    ok(rt.tree.edges.get('r')!.edges.has('icheson'));
  });

  it('returns all children with the same prefix', () => {
    const rt = new RadixTree();
    rt.insert('ben')
      .insert('benjamin')
      .insert('bed')
      .insert('blender')
      .insert('black');

    deepStrictEqual(rt.getChildren('bl'), ['black', 'blender']);
    deepStrictEqual(rt.getChildren('ben'), ['ben', 'benjamin']);
  });

  it('searches and finds leaves', () => {
    const rt = new RadixTree<string>();
    rt.insert('ben', 'ben')
      .insert('benjamin', 'benjamin')
      .insert('richeson', 'richeson')
      .insert('red', 'red');

    strictEqual(rt.search('ben'), 'ben');
    strictEqual(rt.search('benjamin'), 'benjamin');
    strictEqual(rt.search('richeson'), 'richeson');

    ok(rt.has('ben'));
    ok(rt.has('benjamin'));
    ok(rt.has('richeson'));
  });

  it('searches and does not find non-leaves', () => {
    const rt = new RadixTree();
    rt.insert('ben').insert('benjamin');

    strictEqual(rt.search('r'), undefined);
    strictEqual(rt.search('be'), undefined);

    ok(!rt.has('r'));
    ok(!rt.has('be'));
  });
});
