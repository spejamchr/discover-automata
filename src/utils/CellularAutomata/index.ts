import { NumberParseFailure, parseIntR } from '@execonline-inc/numbers';
import Decoder, { string } from 'jsonous';
import { NonEmptyList } from 'nonempty-list';
import { err, ok, Result } from 'resulty';
import { OverflowError, parseBigIntR } from '../BigIntExt';
import { EmptyArrayError, fromArrayResult } from '../Extensions';
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

export const serialize = ({ states, neighbors, ruleId }: AutomataWithRuleId): string =>
  [states, toZigZagCollection(new Set(neighbors)), ruleId].join('.');

export const hashDecoder: Decoder<string> = new Decoder(
  (u: unknown): Result<string, string> =>
    string
      .decodeAny(u)
      .andThen((s) =>
        s[0] === '#'
          ? ok(s.slice(1))
          : err(`Expected a hash string starting with "#", but received ${JSON.stringify(s)}`),
      ),
);

export const deserializeAutomata = (serialized: string): Result<string, Automata> => {
  const [states, zigZagged, ruleId] = serialized.split('.');

  return ok<NumberParseFailure | EmptyArrayError, {}>({})
    .assign('states', parseIntR(states))
    .assign(
      'neighbors',
      ok<NumberParseFailure | EmptyArrayError, string>(zigZagged)
        .andThen(parseIntR)
        .map(fromZigZagCollection)
        .andThen(fromArrayResult),
    )
    .assign('ruleId', parseBigIntR(ruleId))
    .mapError((e) => e.kind)
    .map(automataCtor);
};
