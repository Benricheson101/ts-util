import {describe, it} from 'node:test';
import {strictEqual} from 'node:assert';

import {Graph} from './graph';

describe('struct/Graph', () => {
  const g = new Graph<number, string>();

  it('adds vertices', () => {
    g.addVertex(0, 'A');
    g.addVertex(1, 'B');

    strictEqual(g.size, 2);
  });

  it('joins vertices', () => {
    g.addEdge(0, 1);
    strictEqual(g.get(0)?.neighbors.size, 1);
  });
});
