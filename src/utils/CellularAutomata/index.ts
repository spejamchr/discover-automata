import { NonEmptyList } from 'nonempty-list';
import { Automata, Count, Generation, Index, Neighbors, Rules, State } from './Types';

export const calcRules = (id: number, states: Count, neighbors: Neighbors): Rules => {
  const configurations = states ** neighbors.length;

  const ids = id
    .toString(states)
    .split('')
    .map((s) => parseInt(s, states))
    .reverse();

  while (ids.length < configurations) {
    ids.push(0);
  }

  return ids;
};

export const calcId = (rules: Rules, states: Count): number =>
  parseInt(
    rules
      .map((s) => s.toString(states))
      .reverse()
      .join(''),
    states,
  );

export const automataCtor = (states: Count, neighbors: Neighbors, rules: Rules): Automata => ({
  states,
  neighbors: neighbors.sort(),
  rules,
});

export const automataFromId = (states: Count, neighbors: Neighbors, id: number): Automata =>
  automataCtor(states, neighbors, calcRules(id, states, neighbors));

const calcNextCellOnZero =
  (automata: Automata) =>
  (_cell: State, index: Index, cells: ReadonlyArray<State>): State => {
    return automata.rules[
      parseInt(
        automata.neighbors
          .map((n) => n + index)
          .map((i) => cells[i] || 0)
          .map((s) => s.toString(automata.states))
          .join(''),
        automata.states,
      )
    ];
  };

export const nextCellsOnZero =
  (automata: Automata) =>
  (cells: Generation): Generation => {
    const [first, ...rest] = cells.toArray().map(calcNextCellOnZero(automata));
    return new NonEmptyList(first, rest);
  };
