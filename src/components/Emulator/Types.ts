import { NumberParseFailure } from '@execonline-inc/numbers';
import { Result } from 'resulty';
import HistoryStore from '../../utils/CellularAutomata/HistoryStore';
import { Index } from '../../utils/CellularAutomata/Types';
import { ComparerError, EmptyArrayError } from '../../utils/Extensions';

export type ConfigError = NumberParseFailure | ComparerError | EmptyArrayError;

export type ConfigResult<T> = Result<ConfigError, T>;

export interface Configuring {
  kind: 'configuring';
  states: string;
  neighbors: ReadonlyArray<Index>;
  ruleId: string;
  starting: string;
}

interface Ready {
  kind: 'ready';
  history: HistoryStore;
}

export const configuring = (
  states: string,
  neighbors: ReadonlyArray<Index>,
  ruleId: string,
  starting: string,
): Configuring => ({
  kind: 'configuring',
  states,
  neighbors,
  ruleId,
  starting,
});

export const ready = (history: HistoryStore): Ready => ({
  kind: 'ready',
  history,
});

export type State = Configuring | Ready;
