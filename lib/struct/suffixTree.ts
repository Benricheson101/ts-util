import {RadixTree} from './radixTree';

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
    const startingNode = this.tree.tree.dfs(term, true);
    if (!startingNode) {
      return [];
    }

    // FIXME: should I have to dedupe these or am I doing something wrong
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
