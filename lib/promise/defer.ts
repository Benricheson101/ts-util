export const defer = <T = unknown>(): [
  Promise<T>,
  (arg0?: T) => void,
  (arg0?: unknown) => void,
] => {
  let resolve!: (arg0?: T) => void;
  let reject!: (arg0?: unknown) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve as typeof resolve;
    reject = _reject as typeof reject;
  });

  return [promise, resolve, reject];
};
