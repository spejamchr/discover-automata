import { NonEmptyList } from 'nonempty-list';

export type State = number;
export type Count = number;
export type Index = number;

export type Generation = NonEmptyList<State>;
export type Neighbors = ReadonlyArray<Index>;
export type Rules = ReadonlyArray<State>;

export interface Automata {
  states: Count;
  neighbors: Neighbors;
  rules: Rules;
  ruleId: bigint;
}

export type AutomataWithRuleId = Omit<Automata, 'rules'>;
