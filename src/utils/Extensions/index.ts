import { always, pipe } from '@kofno/piper';
import Decoder, { succeed } from 'jsonous';
import { just, Maybe, nothing } from 'maybeasy';
import { err, ok, Result } from 'resulty';

type Comparer = '<' | '<=' | '===' | '!==' | '>' | '>=';

// using `number | bigint | string` here breaks things. I don't understand why.
export type Int = Number | BigInt | String;

export interface ComparerError {
  kind: 'comparer-error';
  comparer: Comparer;
  target: string;
  value: string;
}

const comparison = <T extends Int>(comparer: Comparer, target: T, value: T): boolean => {
  switch (comparer) {
    case '<':
      return value < target;
    case '<=':
      return value <= target;
    case '===':
      return value === target;
    case '!==':
      return value !== target;
    case '>':
      return value > target;
    case '>=':
      return value >= target;
  }
};

const comparerErrorR = <T extends Int>(comparer: Comparer, target: T, value: T): ComparerError => ({
  kind: 'comparer-error',
  comparer,
  target: String(target),
  value: String(value),
});

const whenComparedR =
  (comparer: Comparer) =>
  <T extends Int>(target: T) =>
  (value: T): Result<ComparerError, T> =>
    comparison(comparer, target, value) ? ok(value) : err(comparerErrorR(comparer, target, value));

export const whenLTR = whenComparedR('<');
export const whenLER = whenComparedR('<=');
export const whenEQR = whenComparedR('===');
export const whenNER = whenComparedR('!==');
export const whenGTR = whenComparedR('>');
export const whenGER = whenComparedR('>=');

export const whenBetweenR =
  <T extends Int>(min: T, max: T) =>
  (x: T): Result<ComparerError, T> =>
    ok<ComparerError, T>(x).andThen(whenGER(min)).andThen(whenLER(max));

const whenComparedByR =
  (comparer: Comparer) =>
  <T extends Int, A>(target: T, by: (a: A) => T) =>
  (a: A): Result<ComparerError, A> => {
    const value = by(a);
    return comparison(comparer, target, value)
      ? ok(a)
      : err(comparerErrorR(comparer, target, value));
  };

export const whenByLTR = whenComparedByR('<');
export const whenByLER = whenComparedByR('<=');
export const whenByEQR = whenComparedByR('===');
export const whenByNER = whenComparedByR('!==');
export const whenByGTR = whenComparedByR('>');
export const whenByGER = whenComparedByR('>=');

export const whenBetweenByR =
  <T extends Int, A>(min: T, max: T, by: (a: A) => T) =>
  (a: A): Result<ComparerError, A> =>
    ok<ComparerError, A>(a).map(by).andThen(whenBetweenR(min, max)).map(always(a));

export const fromResultM = <T>(result: Result<unknown, T>): Maybe<T> =>
  result.map(just).getOrElse(nothing);

const whenComparedD =
  (comparer: Comparer) =>
  <T extends Int>(target: T) =>
  (value: T): Decoder<T> =>
    new Decoder(() => {
      return whenComparedR(comparer)(target)(value).mapError(
        () => `Comparison failed: [value ${value}] ${comparer} ${target}`,
      );
    });

export const whenLTD = whenComparedD('<');
export const whenLED = whenComparedD('<=');
export const whenEQD = whenComparedD('===');
export const whenNED = whenComparedD('!==');
export const whenGTD = whenComparedD('>');
export const whenGED = whenComparedD('>=');

export const whenBetweenD =
  <T extends Int>(min: T, max: T) =>
  (target: T): Decoder<T> =>
    whenGED(min)(target).andThen(whenLED(max));

const whenComparedByD =
  (comparer: Comparer) =>
  <T extends Int, A>(target: T, by: (a: A) => T) =>
  (a: A): Decoder<A> =>
    new Decoder(() => {
      const value = by(a);
      return comparison(comparer, target, value)
        ? ok(a)
        : err(`Comparison failed: [value ${value}] ${comparer} ${target}`);
    });

export const whenByLTD = whenComparedByD('<');
export const whenByLED = whenComparedByD('<=');
export const whenByEQD = whenComparedByD('===');
export const whenByNED = whenComparedByD('!==');
export const whenByGTD = whenComparedByD('>');
export const whenByGED = whenComparedByD('>=');

export const whenBetweenByD =
  <T extends Int, A>(min: T, max: T, by: (a: A) => T) =>
  (a: A): Decoder<A> =>
    succeed(a).map(by).andThen(whenGED(min)).andThen(whenLED(max)).map(always(a));

const whenComparedM =
  (comparer: Comparer) =>
  (target: number) =>
  (value: number): Maybe<number> =>
    comparison(comparer, target, value) ? just(value) : nothing();

export const whenGTM = whenComparedM('>');
export const whenGEM = whenComparedM('>=');
export const whenEQM = whenComparedM('===');
export const whenNEM = whenComparedM('!==');
export const whenLTM = whenComparedM('<');
export const whenLEM = whenComparedM('<=');

export const whenBetweenM = (min: number, max: number) => pipe(whenBetweenR(min, max), fromResultM);
