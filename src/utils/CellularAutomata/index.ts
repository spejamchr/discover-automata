import { NonEmptyList } from 'nonempty-list';
import { Automata, Count, Generation, Index, Neighbors, Rules, State } from './Types';

// The digits are stored in little-endian order, so that the index of the digit
// is also the exponent needed to get the value of that digit
interface IntBase {
  base: number;
  digits: ReadonlyArray<number>;
}

const toBase =
  (base: number) =>
  (int: number): IntBase => {
    const digits: Array<number> = [];
    while (int !== 0) {
      digits.push(int % base);
      int -= digits[digits.length - 1];
      int /= base;
    }
    return { base, digits };
  };

const fromBase = ({ base, digits }: IntBase): number =>
  digits.reduce((int, digit, exp) => int + digit * base ** exp, 0);

export const calcRules = (id: number, states: Count, neighbors: Neighbors): Rules => {
  const configurations = states ** neighbors.length;

  const ids = toBase(states)(id).digits as Array<number>;

  while (ids.length < configurations) {
    ids.push(0);
  }

  return ids;
};

export const calcId = (rules: Rules, states: Count): number =>
  fromBase({ base: states, digits: rules });

export const automataCtor = (states: Count, neighbors: Neighbors, rules: Rules): Automata => ({
  states,
  neighbors: neighbors.sort(),
  rules,
});

export const automataFromId = (states: Count, neighbors: Neighbors, id: number): Automata =>
  automataCtor(states, neighbors, calcRules(id, states, neighbors));

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
