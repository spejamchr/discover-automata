import { pipe } from '@kofno/piper';
import { fail } from 'assert';
import Decoder from 'jsonous';
import { Result } from 'resulty';

export const constrain = <T>(result: Result<unknown, T>): T =>
  result
    .mapError(String)
    .elseDo(fail)
    .getOrElse(() => fail('unreachable'));

export const constrainTo = <T>(decoder: Decoder<T>): ((u: unknown) => T) =>
  pipe(decoder.decodeAny, constrain);
