// biome-ignore lint/suspicious/noExplicitAny: i want it
export const debounce = <F extends (...args: any[]) => any>(
  f: F,
  time: number
): F => {
  let timer: NodeJS.Timeout | undefined;

  // biome-ignore lint/suspicious/noExplicitAny: i want it
  return function (this: any, ...args: Parameters<F>) {
    if (!timer) {
      f.apply(this, args);
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, time);
  } as F;
};

// biome-ignore lint/suspicious/noExplicitAny: i want it
export const throttle = <F extends (...args: any[]) => any>(
  f: F,
  time: number,
  {leading = true, trailing = false} = {}
): F => {
  let timer: NodeJS.Timeout | undefined;

  // biome-ignore lint/suspicious/noExplicitAny: i want it
  function run(this: any, ...args: Parameters<F>) {
    if (timer) {
      return;
    }

    if (leading) {
      console.log('leading call');
      f.apply(this, args);
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      if (trailing) {
        console.log('trailing call');
        f.apply(this, args);
      }

      timer = undefined;
    }, time);
  }

  return run as F;
};
