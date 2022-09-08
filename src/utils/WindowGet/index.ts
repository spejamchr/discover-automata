import { err, ok, Result } from 'resulty';

export interface WindowError {
  kind: 'window-error';
}

export const windowGet = <T extends keyof Window>(key: T): Result<WindowError, Window[T]> => {
  try {
    return ok(window[key]);
  } catch {
    return err({ kind: 'window-error' });
  }
};
