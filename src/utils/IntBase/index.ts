// The digits are stored in little-endian order, so that the index of the digit
// is also the exponent needed to get the value of that digit
export interface IntBase {
  base: number;
  digits: ReadonlyArray<number>;
}

export const toBase =
  (base: number) =>
  (int: number): IntBase => {
    const digits: Array<number> = [];
    while (int !== 0) {
      digits.push(int % base);
      int -= digits[digits.length - 1];
      int /= base;
    }
    return { base, digits };
  };

export const fromBase = ({ base, digits }: IntBase): number =>
  digits.reduce((int, digit, exp) => int + digit * base ** exp, 0);
