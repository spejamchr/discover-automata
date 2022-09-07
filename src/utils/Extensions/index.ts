import { pipe } from '@kofno/piper';
import { just, Maybe, nothing } from 'maybeasy';
import { fromArrayMaybe, NonEmptyList } from 'nonempty-list';
import { err, ok, Result } from 'resulty';

type Comparer = '<' | '<=' | '===' | '>' | '>=';

export type Int = Number | BigInt;

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
export const whenGTR = whenComparedR('>');
export const whenGER = whenComparedR('>=');

export const whenBetweenR =
  <T extends Int>(min: T, max: T) =>
  (x: T): Result<ComparerError, T> =>
    ok<ComparerError, T>(x).andThen(whenGER(min)).andThen(whenLER(max));

export const fromResultM = <T>(result: Result<unknown, T>): Maybe<T> =>
  result.map(just).getOrElse(nothing);

const whenComparedM =
  (comparer: Comparer) =>
  (target: number) =>
  (value: number): Maybe<number> =>
    comparison(comparer, target, value) ? just(value) : nothing();

export const whenGTM = whenComparedM('>');
export const whenGEM = whenComparedM('>=');
export const whenEQM = whenComparedM('===');
export const whenLTM = whenComparedM('<');
export const whenLEM = whenComparedM('<=');

export const whenBetweenM = (min: number, max: number) => pipe(whenBetweenR(min, max), fromResultM);

export interface EmptyArrayError {
  kind: 'empty-array-error';
}

export const emptyArrayError = (): EmptyArrayError => ({ kind: 'empty-array-error' });

type NonEmptyListResult<T> = Result<EmptyArrayError, NonEmptyList<T>>;

export const fromArrayResult = <T>(a: ReadonlyArray<T>): NonEmptyListResult<T> =>
  fromArrayMaybe(a)
    .map<NonEmptyListResult<T>>(ok)
    .getOrElse(pipe<void, EmptyArrayError, NonEmptyListResult<T>>(emptyArrayError, err));
