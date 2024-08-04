export class Graph<K, V = undefined> extends Map<
  K,
  {data?: V; neighbors: Map<K, number>}
> {
  addVertex(id: K, data?: V) {
    if (this.has(id)) {
      throw new Error('vertex exists');
    }

    this.set(id, {data, neighbors: new Map()});
  }

  addEdge(from: K, to: K, weight = 0) {
    if (!this.has(from) || !this.has(to)) {
      throw new Error("vertex doesn't exist");
    }

    const fromVertex = this.get(from)!;
    fromVertex.neighbors.set(to, weight);
  }

  addEdgeUndirected(from: K, to: K, weight = 0) {
    this.addEdge(from, to, weight);
    this.addEdge(to, from, weight);
  }
}
