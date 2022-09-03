import { pipe } from '@kofno/piper';
import { fail } from 'assert';
import Decoder from 'jsonous';
import { Result } from 'resulty';

export const assertResult = <T>(result: Result<unknown, T>): T =>
  result
    .mapError(String)
    .elseDo(fail)
    .getOrElse(() => fail('unreachable'));

export const assertIs = <T>(decoder: Decoder<T>): ((u: unknown) => T) =>
  pipe(decoder.decodeAny, assertResult);

export const assertNever = (n: never): never => {
  fail(`Expected never but got ${JSON.parse(n)}`);
};
