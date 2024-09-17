export const luhnCheck = (input: number): boolean => {
  const number = input.toString();
  const digits = number.replace(/\D/g, '').split('').map(Number);
  let sum = 0;
  let isSecond = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    if (isSecond) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isSecond = !isSecond;
  }
  return sum % 10 === 0;
};

// export const isValidLuhn = (nr: number)=> {
//   const digits = nr
//     .toString()
//     .split('')
//   .reverse()
//   .reduce((a, c, i, l) => a + (Number(c) * (2 - ((l.length - i - 1) % 2))), 0);
//   // .reduce((a, c, i, l) => (Number(c) * (((l.length - i - 1) % 2) + 1)), 0);
//
//   return digits;
//
//   // let checkDigit = 0;
//   //
//   // for (let i = digits.length - 1, isSnd = true; i >= 0; i--, isSnd = !isSnd) {
//   //   if (isSnd) {
//   //     digits[i] *= 2;
//   //   } else {
//   //
//   //   }
//   // }
// }
//
// console.log(isValidLuhn(1789372997))
