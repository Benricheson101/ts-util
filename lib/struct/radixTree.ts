import {prefixOverlap} from '../string';

export class RadixNode<T> {
  edges = new Map<string, RadixNode<T>>();
  constructor(
    public data: T,
    public isLeaf = true
  ) {}
}

export class RadixTree<T> {
  #tree = new RadixNode<T>(null as T, false);

  insert(term: string, data: T) {
    const walkTree = (tree: RadixNode<T>): RadixNode<T> => {
      for (let [edge] of tree.edges) {
        const ol = prefixOverlap(edge, term);

        if (ol) {
          if (ol !== edge) {
            const newRemEdge = edge.slice(ol.length);

            const newEdge = new RadixNode(null as T, false);
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
      tree.edges.set(term, new RadixNode(data));
    } else {
      tree.isLeaf = true;
      tree.data = data;
    }

    return this;
  }

  search(term: string): T | undefined {
    const lookupTree = (tree: RadixNode<T>, term: string): T | undefined => {
      for (const [edge, _nde] of tree.edges) {
        const ol = prefixOverlap(edge, term);
        if (ol) {
          if (ol === term) {
            const node = tree.edges.get(term)!;
            return node.isLeaf ? node.data : undefined;
          }

          return lookupTree(tree.edges.get(ol)!, term.slice(ol.length));
        }
      }
    };

    return lookupTree(this.#tree, term);
  }

  get tree() {
    return this.#tree;
  }
}
