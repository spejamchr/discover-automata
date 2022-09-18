import { NumberParseFailure, parseIntR } from '@execonline-inc/numbers';
import { NonEmptyList } from 'nonempty-list';
import { ok, Result } from 'resulty';
import { OverflowError, parseBigIntR } from '../BigIntExt';
import { fromBase, fromBaseBig, toBaseBig } from '../IntBase';
import { fromZigZagCollection, toZigZagCollection } from '../ZigZag';
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
          .slice()
          .reverse()
          .map((n) => n + index)
          .map((i) => cells[i] || 0),
        base: automata.states,
      })
    ];

export const nextCellsOnZero =
  (automata: Automata) =>
  (cells: Generation): Generation => {
    const [first, ...rest] = cells.toArray().map(calcNextCellOnZero(automata));
    return new NonEmptyList(first, rest);
  };

export const serialize = ({ states, neighbors, ruleId }: AutomataWithRuleId): string =>
  [states, toZigZagCollection(new Set(neighbors)), ruleId].join('.');

export const deserializeAutomata = (serialized: string): Result<string, Automata> => {
  const [states, zigZagged, ruleId] = serialized.split('.');

  return ok<NumberParseFailure, {}>({})
    .assign('states', parseIntR(states))
    .assign('neighbors', parseIntR(zigZagged).map(fromZigZagCollection))
    .assign('ruleId', parseBigIntR(ruleId))
    .mapError((e) => e.kind)
    .map(automataCtor);
};
