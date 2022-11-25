import { always } from '@kofno/piper';
import { Result } from 'resulty';
import { fromRaisableR } from '../Extensions';

export interface WindowError {
  kind: 'window-error';
}

export const windowGet = <T extends keyof Window>(key: T): Result<WindowError, Window[T]> =>
  fromRaisableR(() => window[key]).mapError(always({ kind: 'window-error' }));
