import { NumberParseFailure } from '@execonline-inc/numbers';
import Decoder from 'jsonous';
import { err, ok, Result } from 'resulty';

export const bigIntDecoder: Decoder<bigint> = new Decoder((u: unknown): Result<string, bigint> => {
  if (typeof u === 'string' || typeof u === 'number') {
    try {
      return ok(BigInt(u));
    } catch (e) {
      return err(`Could not parse value as bigint: ${e} (${JSON.stringify(u)})`);
    }
  } else {
    return err(`Expected a bigint but received ${JSON.stringify(u)}`);
  }
});

export const parseBigIntR = (num: string): Result<NumberParseFailure, bigint> =>
  bigIntDecoder.decodeAny(num).mapError((message) => ({ kind: 'number-parse-failure', message }));

export interface OverflowError {
  kind: 'overflow-error';
}

const overflowError = (): OverflowError => ({ kind: 'overflow-error' });

// Can overflow
const unsafeBigPow = (big: bigint, exp: number): bigint | never => {
  if (exp <= 0) {
    return BigInt(1);
  } else {
    let r = big;
    while (exp > 1) {
      if (exp % 2 === 0) {
        r *= r;
        exp /= 2;
      } else {
        r *= r * r;
        exp -= 1;
        exp /= 2;
      }
    }
    return r;
  }
};

export const bigPow = (big: bigint, exp: number): Result<OverflowError, bigint> => {
  try {
    return ok(unsafeBigPow(big, exp));
  } catch {
    return err(overflowError());
  }
};
