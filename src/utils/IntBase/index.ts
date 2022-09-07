// The digits are stored in little-endian order, so that the index of the digit

import { fail } from 'assert';
import { ok, Result } from 'resulty';
import { bigPow, OverflowError } from '../BigIntExt';

// is also the exponent needed to get the value of that digit
export interface IntBase {
  kind: 'int-base';
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
    return { kind: 'int-base', base, digits };
  };

export const fromBase = ({ base, digits }: IntBase): number =>
  digits.reduce((int, digit, exp) => int + digit * base ** exp, 0);

export interface BigIntBase {
  kind: 'big-int-base';
  base: number;
  digits: ReadonlyArray<number>;
}

export const toBaseBig =
  (base: number) =>
  (int: bigint): BigIntBase => {
    const bigBase = BigInt(base);
    const digits: Array<number> = [];
    const maxNum = BigInt(Number.MAX_SAFE_INTEGER);
    while (int !== BigInt('0')) {
      const digit = int % bigBase;
      if (digit > maxNum) fail('digit is too big! This should never happen!');
      digits.push(Number(String(digit)));
      int -= digit;
      int /= bigBase;
    }
    return { kind: 'big-int-base', base, digits };
  };

export const fromBaseBig = ({ base, digits }: BigIntBase): Result<OverflowError, bigint> => {
  const bigBase = BigInt(base);

  return digits.reduce(
    (intR, digit, exp) =>
      intR.andThen((int) => bigPow(bigBase, exp).map((pow) => int + BigInt(digit) * pow)),
    ok<OverflowError, bigint>(BigInt(0)),
  );
};
