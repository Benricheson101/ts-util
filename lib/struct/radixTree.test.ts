import {deepStrictEqual, ok, strictEqual} from 'node:assert';
import {describe, it} from 'node:test';

import {RadixTree} from './radixTree';

describe('struct/RadixTree', () => {
  it('inserts non-overlapping terms at the same depth', () => {
    const rt = new RadixTree();
    rt.insert('ben').insert('richeson');

    ok(rt.has('b'));
    ok(rt.has('r'));
  });

  it('inserts overlapping terms with existing prefix', () => {
    const rt = new RadixTree<undefined>();
    rt.insert('benjamin').insert('bendy');

    ok(rt.get('b')?.has('j'));
    ok(rt.get('b')?.has('d'));
  });

  it('inserts overlapping terms requiring splitting prefix', () => {
    const rt = new RadixTree<undefined>();
    rt.insert('richeson').insert('red').insert('bendy');

    ok(rt.get('r')?.has('e'));
    ok(rt.get('r')?.has('i'));
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

    strictEqual(rt.search('ben')?.data, 'ben');
    strictEqual(rt.search('benjamin')?.data, 'benjamin');
    strictEqual(rt.search('richeson')?.data, 'richeson');

    ok(rt.has('b'));
    ok(rt.has('r'));
  });

  it('holds data', () => {
    const rt = new RadixTree<{a: string}>();

    rt.insert('ben', {a: 'first'});
    rt.insert('bed', {a: 'second'});
    rt.insert('bad', {a: 'third'});

    deepStrictEqual(rt.get('b')?.data, null);
    deepStrictEqual(rt.get('b')?.get('e')?.get('n')?.data, {a: 'first'});
    deepStrictEqual(rt.get('b')?.get('e')?.get('d')?.data, {a: 'second'});
    deepStrictEqual(rt.get('b')?.get('a')?.data, {a: 'third'});
  });
});
