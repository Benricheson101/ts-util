import {throttle} from './throttle';

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  f: F,
  time: number
) =>
  throttle(f, time, {
    leading: false,
    trailing: true,
    resetOnSubsequentCalls: true,
  });
