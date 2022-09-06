import { NumberParseFailure } from '@execonline-inc/numbers';
import { Result } from 'resulty';
import { Automata, Index } from '../../utils/CellularAutomata/Types';
import { ComparerError, EmptyArrayError } from '../../utils/Extensions';

export type ConfigError = NumberParseFailure | ComparerError | EmptyArrayError;

export type ConfigResult<T> = Result<ConfigError, T>;

export interface Configuring {
  kind: 'configuring';
  states: string;
  neighbors: ReadonlyArray<Index>;
  ruleId: string;
  automata: Automata;
  showStateLabels: boolean;
  displayInColor: boolean;
}

export const configuring = (
  states: string,
  neighbors: ReadonlyArray<Index>,
  ruleId: string,
  automata: Automata,
  showStateLabels: boolean,
  displayInColor: boolean,
): Configuring => ({
  kind: 'configuring',
  states,
  neighbors,
  ruleId,
  automata,
  showStateLabels,
  displayInColor,
});

export type State = Configuring;
