export class Queue<Data> {
  #buf: Data[] = [];

  push = this.enqueue;
  pop = this.dequeue;

  enqueue(data: Data) {
    this.#buf.push(data);
  }

  dequeue() {
    return this.#buf.shift();
  }

  peek() {
    return this.#buf[0];
  }

  empty() {
    return !this.#buf.length;
  }

  size() {
    return this.#buf.length;
  }
}
