import { NumberParseFailure } from '@execonline-inc/numbers';
import { Result } from 'resulty';
import { Index } from '../../utils/CellularAutomata/Types';
import { ComparerError, EmptyArrayError } from '../../utils/Extensions';

export type ConfigError = NumberParseFailure | ComparerError | EmptyArrayError;

export type ConfigResult<T> = Result<ConfigError, T>;

export interface Configuring {
  kind: 'configuring';
  states: string;
  neighbors: ReadonlyArray<Index>;
  ruleId: string;
}

export const configuring = (
  states: string,
  neighbors: ReadonlyArray<Index>,
  ruleId: string,
): Configuring => ({
  kind: 'configuring',
  states,
  neighbors,
  ruleId,
});

export type State = Configuring;
