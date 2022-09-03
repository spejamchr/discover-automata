import { pipe } from '@kofno/piper';
import { just, Maybe, nothing } from 'maybeasy';
import { fromArrayMaybe, NonEmptyList } from 'nonempty-list';
import { err, ok, Result } from 'resulty';

type Comparer = '<' | '<=' | '===' | '>' | '>=';

export interface ComparerError {
  kind: 'comparer-error';
  comparer: Comparer;
  target: number;
  value: number;
}

const comparison = (comparer: Comparer, target: number, value: number): boolean => {
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

const comparerErrorR = (comparer: Comparer, target: number, value: number): ComparerError => ({
  kind: 'comparer-error',
  comparer,
  target,
  value,
});

const whenComparedR =
  (comparer: Comparer) =>
  (target: number) =>
  (value: number): Result<ComparerError, number> =>
    comparison(comparer, target, value) ? ok(value) : err(comparerErrorR(comparer, target, value));

export const whenLTR = whenComparedR('<');
export const whenLER = whenComparedR('<=');
export const whenEQR = whenComparedR('===');
export const whenGTR = whenComparedR('>');
export const whenGER = whenComparedR('>=');

export const whenBetweenR =
  (min: number, max: number) =>
  (x: number): Result<ComparerError, number> =>
    ok<ComparerError, number>(x).andThen(whenGER(min)).andThen(whenLER(max));

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
