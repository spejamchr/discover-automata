import { NonEmptyList } from 'nonempty-list';
import { fromBase, toBase } from '../IntBase';
import { Automata, Generation, Index, Rules, State } from './Types';

const calcRules = ({ ruleId, states, neighbors }: Omit<Automata, 'rules'>): Rules => {
  const ids = toBase(states)(ruleId).digits as Array<number>;
  const configurations = states ** neighbors.length;

  while (ids.length < configurations) ids.push(0);

  return ids;
};

export const automataCtor = (omitted: Omit<Automata, 'rules'>): Automata => ({
  ...omitted,
  rules: calcRules(omitted),
});

const calcNextCellOnZero =
  (automata: Automata) =>
  (_cell: State, index: Index, cells: ReadonlyArray<State>): State =>
    automata.rules[
      fromBase({
        digits: automata.neighbors
          .map((n) => n + index)
          .map((i) => cells[i] || 0)
          .toArray(),
        base: automata.states,
      })
    ];

export const nextCellsOnZero =
  (automata: Automata) =>
  (cells: Generation): Generation => {
    const [first, ...rest] = cells.toArray().map(calcNextCellOnZero(automata));
    return new NonEmptyList(first, rest);
  };

export const serialize = (automata: Automata): string =>
  [automata.states, automata.neighbors.join(':'), automata.ruleId].join('/');
