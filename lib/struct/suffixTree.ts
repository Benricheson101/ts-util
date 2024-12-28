import {RadixTree} from './radixTree';

/**
 * Similar to a {@link RadixTree}, but inserts every suffix of a term.
 * This is useful for autocompletion or searching from the middle of a term
 */
export class SuffixTree<T = undefined> {
  readonly tree = new RadixTree<{data: T; term: string}>();
  #terminatorNumber = 0;
  #terminatorCharacter = '$';

  insert(
    ...args: T extends undefined ? [term: string] : [term: string, data: T]
  ) {
    let [term, data] = args as [term: string, data: T];
    const nodeData = {term, data};

    const termLen = term.length;

    term += `${this.#terminatorCharacter}${this.#terminatorNumber++}`;

    for (let i = 0; i < termLen; i++) {
      this.tree.insert(term.slice(i), nodeData);
    }

    return this;
  }

  getChildren(term: string): string[] {
    const startingNode = this.tree.search(term);
    if (!startingNode) {
      return [];
    }

    return Array.from(
      new Set(
        startingNode
          .dft()
          .filter(n => n.isLeaf)
          .map(n => n.data.term)
      )
    );
  }
}
