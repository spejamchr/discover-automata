import { NumberParseFailure, parseIntR } from '@execonline-inc/numbers';
import { always } from '@kofno/piper';
import Decoder, { array, field, number, string, succeed } from 'jsonous';
import { err, ok, Result } from 'resulty';
import { automataCtor } from '.';
import { ConfigError } from '../../components/Emulator/Types';
import { bigIntDecoder, bigPow } from '../BigIntExt';
import {
  EmptyArrayError,
  fromArrayResult,
  whenBetweenByD,
  whenBetweenD,
  whenByGED,
  whenByLED,
  whenGTR,
} from '../Extensions';
import { fromZigZagCollection } from '../ZigZag';
import { Automata, AutomataWithRuleId, Count, Neighbors } from './Types';

type StatesNeighbors = Pick<Automata, 'states' | 'neighbors'>;

// Arbitrary limit... we display these, so we don't want too many
export const maxRuleCount = 100;

export const minConsiderableStates = 1;
export const maxConsiderableStates = Math.floor(Math.sqrt(maxRuleCount));

export const minConsiderableNeighbors = 1;
export const maxConsiderableNeighbors = Math.floor(Math.log2(maxRuleCount));

export const minNeighborIndex = -3;
export const maxNeighborIndex = 3;

export const statesDecoder: Decoder<Count> = number.andThen(
  whenBetweenD(minConsiderableStates, maxConsiderableStates),
);

export const neighborDecoder: Decoder<number> = number.andThen(
  whenBetweenD(minNeighborIndex, maxNeighborIndex),
);

export const neighborsDecoder: Decoder<Neighbors> = array(neighborDecoder)
  .andThen((a) => new Decoder(() => fromArrayResult(a).mapError((e) => e.kind)))
  .andThen(whenBetweenByD(minConsiderableNeighbors, maxConsiderableNeighbors, (n) => n.length));

export const statesAndNeighborsPassMaxRuleCountCheck = <T extends StatesNeighbors>(
  a: T,
): Decoder<T> => whenByLED(maxRuleCount, (a: T) => a.states ** a.neighbors.length)(a);

export const statesAndNeighborsDecoder: Decoder<{ states: number; neighbors: Neighbors }> = succeed(
  {},
)
  .assign('states', field('states', statesDecoder))
  .assign('neighbors', field('neighbors', neighborsDecoder))
  .andThen(statesAndNeighborsPassMaxRuleCountCheck);

export const ruleIdDecoder: Decoder<bigint> = bigIntDecoder;

export const maxStates = (neighbors: Neighbors): Count => {
  const roughMax = Math.round(Math.pow(maxRuleCount, 1 / neighbors.length));
  const max = roughMax ** neighbors.length > maxRuleCount ? roughMax - 1 : roughMax;
  return Math.min(max, maxConsiderableStates);
};

export const statesPassesMaxCheck = <T extends StatesNeighbors>(a: T): Decoder<T> =>
  whenByLED(maxStates(a.neighbors), (a: T) => a.states)(a);

const testSNR = (states: number, neighbors: number, ruleId: bigint): boolean =>
  ok<ConfigError, number>(states)
    .andThen(() => bigPow(BigInt(states), states ** neighbors))
    .andThen(whenGTR(ruleId))
    .map(always(true))
    .getOrElseValue(false);

export const minStates = (neighbors: Neighbors, ruleId: bigint): Count => {
  let min = minConsiderableStates;
  while (!testSNR(min, neighbors.length, ruleId)) {
    min++;
  }
  return Math.min(min, maxStates(neighbors));
};

export const statesPassesMinCheck = <T extends AutomataWithRuleId>(a: T): Decoder<T> =>
  whenByGED(minStates(a.neighbors, a.ruleId), (a: T) => a.states)(a);

export const maxNeighbors = (states: Count): Count => {
  const max = Math.round(Math.log(maxRuleCount) / Math.log(states));
  const r = states ** max > maxRuleCount ? max - 1 : max;
  return Math.min(r, maxConsiderableNeighbors);
};

export const neighborsPassesMaxCheck = <T extends StatesNeighbors>(a: T): Decoder<T> =>
  whenByLED(maxNeighbors(a.states), (a: T) => a.neighbors.length)(a);

export const minNeighbors = (states: Count, ruleId: bigint): Count => {
  let min = minConsiderableNeighbors;
  while (!testSNR(states, min, ruleId)) {
    min++;
  }
  return Math.min(min, maxNeighbors(states));
};

export const neighborsPassesMinCheck = <T extends AutomataWithRuleId>(a: T): Decoder<T> =>
  whenByGED(minNeighbors(a.states, a.ruleId), (a: T) => a.neighbors.length)(a);

export const minRuleId: bigint = BigInt(0);

export const ruleIdPassesMinCheck = <T extends Pick<Automata, 'ruleId'>>(a: T): Decoder<T> =>
  whenByGED(minRuleId, (a: T) => a.ruleId)(a);

export const maxRuleId = (states: number, neighbors: Neighbors): Result<string, bigint> =>
  bigPow(BigInt(states), states ** neighbors.length)
    .map((max) => max - BigInt(1))
    .mapError(() => 'Overflow error - values for states and neighbors are too large');

export const ruleIdPassesMaxCheck = <T extends AutomataWithRuleId>(a: T): Decoder<T> =>
  new Decoder(() => maxRuleId(a.states, a.neighbors)).andThen((max) =>
    whenByLED(max, (a: T) => a.ruleId)(a),
  );

// We don't need to test the states or neighbors min checks here, because the
// ruleId max check does an equivalent check.
export const automataWithRuleIdPassesMinMaxChecks = <T extends AutomataWithRuleId>(
  a: T,
): Decoder<T> =>
  succeed(a)
    .andThen(ruleIdPassesMinCheck)
    .andThen(statesPassesMaxCheck)
    .andThen(neighborsPassesMaxCheck)
    .andThen(ruleIdPassesMaxCheck);

export const automataWithRuleIdDecoder: Decoder<Automata> = statesAndNeighborsDecoder
  .assign('ruleId', field('ruleId', ruleIdDecoder))
  .andThen(automataWithRuleIdPassesMinMaxChecks)
  .map(automataCtor);

const automataWithRuleIdFromSerialization = (
  states: string,
  zigZagged: string,
  ruleId: string,
): Result<string, Automata> =>
  ok<NumberParseFailure | EmptyArrayError, { ruleId: string }>({ ruleId })
    .do(() => console.log(`[SJC] automataWithRuleIdFromSerialization`, states, zigZagged, ruleId))
    .assign('states', parseIntR(states))
    .assign(
      'neighbors',
      ok<NumberParseFailure | EmptyArrayError, string>(zigZagged)
        .andThen(parseIntR)
        .map(fromZigZagCollection),
    )
    .mapError<string>((e) => e.kind)
    .andThen((a) => automataWithRuleIdDecoder.decodeAny(a));

export const serializedAutomataDecoder: Decoder<Automata> = string
  .map((s) => (s[0] === '#' ? s.slice(1) : s.slice(0)))
  .map((s) => s.split('.'))
  .andThen(
    (a) =>
      new Decoder(() =>
        a.length === 3
          ? automataWithRuleIdFromSerialization(a[0], a[1], a[2])
          : err(`Expected 3 '.'-separated sections, but received: ${a.length}`),
      ),
  );
