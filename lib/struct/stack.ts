export class Stack<Data> {
  #buf: Data[] = [];

  push(data: Data) {
    this.#buf.push(data);
  }

  pop() {
    return this.#buf.pop();
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

  get buf() {
    return this.#buf;
  }
}
