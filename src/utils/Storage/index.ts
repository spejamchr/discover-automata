import { pipe } from '@kofno/piper';
import Decoder from 'jsonous';
import { fromNullable, just, Maybe, nothing } from 'maybeasy';
import { err, ok, Result } from 'resulty';
import { resultToTask } from '../Extensions';

export interface SetItemError {
  kind: 'set-item-error';
  key: string;
  item: string;
  error: unknown;
}

const setItemError = (key: string, item: string, error: unknown): SetItemError => ({
  kind: 'set-item-error',
  key,
  item,
  error,
});

export interface KeyAndItem {
  key: string;
  item: string;
}

export interface KeyAndObject<T> {
  key: string;
  object: T;
}

export const setItemR = ({ key, item }: KeyAndItem): Result<SetItemError, KeyAndItem> => {
  try {
    window.localStorage.setItem(key, item);
    return ok({ key, item });
  } catch (e) {
    return err(setItemError(key, item, e));
  }
};

export const setItemT = pipe(setItemR, resultToTask);

export const setObjectR = <T>({ key, object }: KeyAndObject<T>) =>
  setItemR({ key, item: JSON.stringify(object) });

export const setObjectT = pipe(setObjectR, resultToTask);

export interface GetItemError {
  kind: 'get-item-error';
  key: string;
  error: unknown;
}

const getItemError = (key: string, error: unknown): GetItemError => ({
  kind: 'get-item-error',
  key,
  error,
});

export const getItemR = (key: string): Result<GetItemError, Maybe<string>> => {
  try {
    return ok(fromNullable(window.localStorage.getItem(key)));
  } catch (e) {
    return err(getItemError(key, e));
  }
};

export const getItemT = pipe(getItemR, resultToTask);

export type GetObjectError = GetItemError | string;

export interface KeyAndDecoder<T> {
  key: string;
  decoder: Decoder<T>;
}

export const getObjectR = <T>({
  key,
  decoder,
}: KeyAndDecoder<T>): Result<GetObjectError, Maybe<T>> =>
  ok<GetObjectError, string>(key)
    .andThen(getItemR)
    .map((m) => m.map(decoder.decodeJson))
    .map((m) => m.andThen((r) => r.map(just).getOrElse(nothing)));

export const getObjectT = pipe(getObjectR, resultToTask);

export interface RemoveItemError {
  kind: 'remove-item-error';
  key: string;
  error: unknown;
}

const removeItemError = (key: string, error: unknown): RemoveItemError => ({
  kind: 'remove-item-error',
  key,
  error,
});

export const removeItemR = (key: string): Result<RemoveItemError, string> => {
  try {
    window.localStorage.removeItem(key);
    return ok(key);
  } catch (e) {
    return err(removeItemError(key, e));
  }
};

export const removeItemT = pipe(removeItemR, resultToTask);
