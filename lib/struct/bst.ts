type BSTNode<T> = {
  data: T;
  left?: BSTNode<T>;
  right?: BSTNode<T>;
};

export class BinarySearchTree<T> {
  head?: BSTNode<T>;

  insert(data: T) {
    // if (!this.head) {
    //   this.head = {data};
    //   return this;
    // }

    let node: BSTNode<T> | undefined = this.head;
    let parent: BSTNode<T> | undefined;
    while (node) {
      parent = node;

      if (node.data > data) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    if (!parent) {
      this.head = {data};
      return this;
    }

    if (parent.data > data) {
      parent.left = {data};
    } else {
      parent.right = {data};
    }

    return this;
  }

  search(needle: T) {
    let node = this.head;
    while (node) {
      node = node.data > needle ? node.left : node.right;
    }
  }
}

const bst = new BinarySearchTree<number>();
bst.insert(8).insert(6).insert(4).insert(10).insert(7);

console.dir(bst, {depth: null});
