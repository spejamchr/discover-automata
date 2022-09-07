import { NonEmptyList } from 'nonempty-list';
import { Result } from 'resulty';
import { OverflowError } from '../BigIntExt';
import { fromBase, fromBaseBig, toBaseBig } from '../IntBase';
import { toZigZagCollection } from '../ZigZag';
import {
  Automata,
  AutomataWithRuleId,
  AutomataWithRules,
  Generation,
  Index,
  Rules,
  State,
} from './Types';

const calcRules = ({ ruleId, states, neighbors }: AutomataWithRuleId): Rules => {
  const ids = toBaseBig(states)(ruleId).digits as Array<number>;
  const configurations = states ** neighbors.length;

  while (ids.length < configurations) ids.push(0);

  return ids;
};

export const automataCtor = (partial: AutomataWithRuleId): Automata => ({
  ...partial,
  rules: calcRules(partial),
});

export const automataCtorWithRules = (
  partial: AutomataWithRules,
): Result<OverflowError, Automata> =>
  fromBaseBig({ kind: 'big-int-base', base: partial.states, digits: partial.rules }).map(
    (ruleId) => ({
      ...partial,
      ruleId,
    }),
  );

const calcNextCellOnZero =
  (automata: Automata) =>
  (_cell: State, index: Index, cells: ReadonlyArray<State>): State =>
    automata.rules[
      fromBase({
        kind: 'int-base',
        digits: automata.neighbors
          .reverse()
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

export const serialize = (automata: AutomataWithRuleId): string => {
  return [automata.states, toZigZagCollection(new Set(automata.neighbors)), automata.ruleId]
    .map((n) => n.toString(36))
    .join('.');
};
