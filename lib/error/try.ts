const try$ = <E, F extends (...args: Parameters<F>) => ReturnType<F>>(f: F) =>
  function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): readonly [E, null] | readonly [null, ReturnType<F>] {
    try {
      return [null, f.apply(this, args)];
    } catch (err) {
      return [err as E, null];
    }
  };
const throws = try$((msg: string): number => {
  throw 'error!';
});

const succeeds = try$((msg: string) => msg);

console.log(throws('hewo'));
console.log(succeeds('hewo'));
