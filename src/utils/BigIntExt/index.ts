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
    return err(
      `Expected a string or number parseable as a bigint but received ${JSON.stringify(u)}`,
    );
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
  } else if (exp === 1) {
    return big;
  } else if (exp % 2 === 0) {
    return unsafeBigPow(big * big, exp / 2);
  } else {
    return big * unsafeBigPow(big * big, (exp - 1) / 2);
  }
};

export const bigPow = (big: bigint, exp: number): Result<OverflowError, bigint> => {
  try {
    return ok(unsafeBigPow(big, exp));
  } catch {
    return err(overflowError());
  }
};

// https://stackoverflow.com/a/70384828
export const bigLog10 = (big: bigint) => {
  if (big < 0) return NaN;
  const s = big.toString(10);

  return s.length + Math.log10(Number('0.' + s.substring(0, 15)));
};
