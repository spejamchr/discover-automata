import { NonEmptyList } from 'nonempty-list';

export type State = number;
export type Count = number;
export type Index = number;

export type Generation = NonEmptyList<State>;
export type Neighbors = NonEmptyList<Index>;
export type Rules = ReadonlyArray<State>;

export interface Automata {
  states: Count;
  neighbors: Neighbors;
  rules: Rules;
  ruleId: bigint;
}

export type AutomataWithRules = Omit<Automata, 'ruleId'>;
export type AutomataWithRuleId = Omit<Automata, 'rules'>;
