import {prefixOverlap} from '../string';
import {Stack} from './stack';

export class RadixNode<T> {
  edges = new Map<string, RadixNode<T>>();
  constructor(
    public data: T,
    public term: string,
    public isLeaf = true
  ) {}

  dft() {
    const toVisit = new Stack<RadixNode<T>>();
    toVisit.push(this);

    const results: RadixNode<T>[] = [];
    while (!toVisit.empty()) {
      const node = toVisit.pop()!;
      results.push(node);

      for (const [, n] of node.edges) {
        toVisit.push(n);
      }
    }

    return results;
  }

  dfs(term: string): RadixNode<T> | undefined {
    const toVisit = new Stack<RadixNode<T>>();
    toVisit.push(this);

    let _term = term;

    while (!toVisit.empty()) {
      const node = toVisit.pop()!;

      if (node.term === term && node.isLeaf) {
        return node;
      }

      const [e, n] = [...node.edges.entries()].find(([k]) => prefixOverlap(k, _term)) || [];

      if (e && n) {
        toVisit.push(n);
        _term = _term.slice(e.length);
      }
    }
  }
}

export class RadixTree<T = string> {
  #tree = new RadixNode<T>(null as T, '', false);

  insert(term: string, data?: T) {
    const _term = term;

    const walkTree = (tree: RadixNode<T>): RadixNode<T> => {
      for (let [edge] of tree.edges) {
        const ol = prefixOverlap(edge, term);

        if (ol) {
          if (ol !== edge) {
            const newRemEdge = edge.slice(ol.length);

            const newEdge = new RadixNode(null as T, _term.slice(0, _term.length - term.length + ol.length), false);
            newEdge.edges.set(newRemEdge, tree.edges.get(edge)!);

            tree.edges.set(ol, newEdge);
            tree.edges.delete(edge);
            edge = ol;
          }

          // biome-ignore lint/style/noParameterAssign: i want it
          term = term.slice(ol.length);
          if (term) {
            return walkTree(tree.edges.get(edge)!);
          }
          return tree.edges.get(edge)!;
        }
      }

      return tree;
    };

    const tree = walkTree(this.#tree);

    if (term) {
      tree.edges.set(term, new RadixNode((data || term) as T, _term));
    } else {
      tree.isLeaf = true;
      tree.data = (data || term) as T;
    }

    return this;
  }

  search(term: string): T | undefined {
    const bottomNode = this.#tree.dfs(term);
    return bottomNode?.isLeaf ? bottomNode.data : undefined;
  }

  getChildren(term: string): string[] {
    const startingNode = this.#tree.dfs(term);
    if (!startingNode) {
      return [];
    }

    return startingNode.dft().filter(n => n.isLeaf).map(n => n.term);
  }

  get tree() {
    return this.#tree;
  }
}
