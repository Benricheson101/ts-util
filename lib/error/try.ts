export type Result<T, E = unknown> = readonly [T, null] | readonly [null, E];

/** wraps a function to return `[T, E]` instead of `T throws E` */
export const try$ = <E, F extends (...args: Parameters<F>) => ReturnType<F>>(
  f: F
) =>
  function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): Result<ReturnType<F>, E> {
    try {
      return [f.apply(this, args) as ReturnType<F>, null];
    } catch (err) {
      return [null, err as E];
    }
  };
