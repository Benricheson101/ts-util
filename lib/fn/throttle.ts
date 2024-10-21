import {defer} from '../promise';

export const throttle = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  f: F,
  time: number,
  {leading = true, trailing = false, resetOnSubsequentCalls = false} = {}
): ((...args: Parameters<F>) => Promise<ReturnType<F>>) => {
  let timer: NodeJS.Timeout | undefined;

  let [promise, resolve, reject] = defer<ReturnType<F>>();

  return function (this: any, ...args: Parameters<F>): Promise<ReturnType<F>> {
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (trailing) {
          try {
            resolve(f.apply(this, args));
          } catch (err) {
            reject(err);
            throw err;
          }
        }

        [promise, resolve, reject] = defer<ReturnType<F>>();

        timer = undefined;
      }, time);
    };

    if (timer) {
      if (resetOnSubsequentCalls) {
        reset();
      }

      return promise;
    }

    if (leading) {
      try {
        resolve(f.apply(this, args));
      } catch (err) {
        reject(err);
        throw err;
      }
    }

    reset();

    return promise;
  };
};
