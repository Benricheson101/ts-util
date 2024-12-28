import {prefixOverlap, slicePrefixOverlap} from '../string';
import {Queue} from './queue';
import {Stack} from './stack';

type MergeIfDef<T, U, V> = T extends undefined
  ? U
  : U extends Array<any>
    ? V extends Array<any>
      ? [...U, ...V]
      : never
    : U & V;

/**
 * A RadixTree is a compressed Trie wherein each edge is merged with its parent
 * to form a string. Each edge has the maximum length possible instead of a
 * single character like a traditional trie.
 */
export class RadixNode<T> extends Map<string, RadixNode<T>> {
  public term!: string;
  public isLeaf!: boolean;
  public data!: T;
  public fullTerm!: string;

  constructor(node: RadixNode<T>);
  constructor(term: string, isLeaf: boolean, data: T);
  constructor(
    ...args: MergeIfDef<T, [term: string, isLeaf: boolean], [data: T]>
  );
  constructor(
    ...args: [term: string, isLeaf: boolean, data?: T] | [node: RadixNode<T>]
  ) {
    if (args[0] instanceof RadixNode) {
      super(args[0]);
      this.term = args[0].term;
      this.isLeaf = args[0].isLeaf;
      this.data = args[0].data;
      this.fullTerm = args[0].fullTerm;
    } else {
      super();
      [this.term, this.isLeaf, this.data] = args as [string, boolean, T];

      this.fullTerm = this.term;
    }
  }

  setTerm(term: string) {
    this.term = term;
    return this;
  }

  setData(data: T) {
    this.data = data;
    return this;
  }

  insert<N extends RadixNode<T>>(node: N): this;
  insert(...args: MergeIfDef<T, [term: string], [data: T]>): this;
  insert<N extends RadixNode<T>>(
    ...args: [N] | MergeIfDef<T, [term: string], [data: T]>
  ): this {
    const [arg0, data] = args as [N] | [term: string, data: T];

    const [term, toInsert] =
      typeof arg0 === 'string'
        ? // ? [arg0, new RadixNode(arg0, true, arg0!)]
          [arg0, new RadixNode(arg0, true, data)]
        : [arg0.term, arg0];

    const [remaining, node, seen] = this.traverse(term);

    const sliced = term.slice(0, term.length - remaining.length);

    if (remaining) {
      if (node.term) {
        if (sliced !== seen) {
          const shouldContinue = node.split(seen, sliced, term);
          if (!shouldContinue) {
            return this;
          }
        }
      }

      node.set(remaining[0], toInsert.setTerm(remaining) as RadixNode<T>);
    } else {
      if (node.isLeaf) {
        // FIXME: why does this setData not work??
        node.onConflict(
          toInsert.setTerm(node.term).setData(data as any) as RadixNode<T>
        );
      }

      node.isLeaf ||= toInsert.isLeaf;
    }

    return this;
  }

  /**
   * splits the current node
   * @returns whether or not the insert function should insert the next node. this can be overridden if the split function has to perform some special method of splitting and inserting, but should generally be left as `true`
   */
  split(seenInTree: string, slicedFromNew: string, _newTerm: string) {
    const cloned = new RadixNode(this);
    cloned.term = slicePrefixOverlap(seenInTree, slicedFromNew);
    this.term = this.term.slice(0, this.term.length - cloned.term.length);
    this.clear();
    this.isLeaf = false;
    this.data = null!;
    this.set(cloned.term[0], cloned);

    return true;
  }

  /** what should happen if two nodes with the same term are inserted (default: noop) */
  onConflict(_other: RadixNode<T>) {}

  /** traverses the tree by term prefixes */
  traverse(
    term: string,
    str = ''
  ): readonly [remaining: string, lastNode: RadixNode<T>, seen: string] {
    if (term && this.has(term[0])) {
      const node = this.get(term[0])!;
      return node.traverse(
        term.slice(prefixOverlap(node.term, term).length),
        str + node.term
      );
    }
    return [term, this, str];
  }

  /** searches the tree for a term, returning the last node containing all of `term` */
  search(term: string) {
    const [remaining, node] = this.traverse(term);
    if (!remaining) {
      return node;
    }

    return null;
  }

  /** depth first traversal of the RadixNode and its children */
  dft() {
    const toVisit = new Stack<RadixNode<T>>();
    toVisit.push(this);

    const results: RadixNode<T>[] = [];
    while (!toVisit.empty()) {
      const node = toVisit.pop()!;
      if (node.isLeaf) {
        results.push(node);
      }

      for (const [, n] of node) {
        toVisit.push(n);
      }
    }

    return results;
  }

  /** breadth first traversal of the RadixNode and its children */
  bft() {
    const toVisit = new Queue<RadixNode<T>>();
    toVisit.push(this);

    const results: RadixNode<T>[] = [];
    while (!toVisit.empty()) {
      const node = toVisit.pop()!;
      if (node.isLeaf) {
        results.push(node);
      }

      for (const [, n] of node) {
        toVisit.push(n);
      }
    }

    return results;
  }

  /** get all terms below a particular node. this is useful for autocompletion */
  getChildren(term: string): string[] {
    const children = this.search(term);
    return children?.dft().map(c => c.fullTerm) || [];
  }
}

/**
 * A RadixTree is a compressed Trie wherein each edge is merged with its parent
 * to form a string. Each edge has the maximum length possible instead of a
 * single character like a traditional trie.
 */
export class RadixTree<T = undefined> extends RadixNode<T> {
  constructor() {
    super('', false, null! as T);
  }
}
