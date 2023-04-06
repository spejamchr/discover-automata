import { pipe } from '@kofno/piper';
import { fail } from 'assert';
import Decoder from 'jsonous';
import { Result } from 'resulty';

// Cause a build failure if the result is an error
export const assertResult = <T>(result: Result<unknown, T>): T =>
  result
    .mapError(String)
    .elseDo(fail)
    .getOrElse(() => fail('unreachable'));

export const assertIs = <T>(decoder: Decoder<T>): ((u: unknown) => T) =>
  pipe(decoder.decodeAny, assertResult);
