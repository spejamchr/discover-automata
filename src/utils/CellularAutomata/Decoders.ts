import { stringToNumberDecoder } from '@execonline-inc/decoders';
import { NumberParseFailure, parseIntR } from '@execonline-inc/numbers';
import Decoder, { array, field, number, string, succeed } from 'jsonous';
import { ok, Result } from 'resulty';
import { automataCtor } from '.';
import { bigIntDecoder, bigLog10, bigPow } from '../BigIntExt';
import {
  whenBetweenByD,
  whenBetweenD,
  whenByEQD,
  whenByGED,
  whenByLED,
  whenGED,
} from '../Extensions';
import { fromZigZagCollection } from '../ZigZag';
import { Automata, AutomataWithRuleId, Count, Neighbors } from './Types';

type StatesNeighbors = Pick<Automata, 'states' | 'neighbors'>;

// Arbitrary limit... we display these, so we don't want too many
export const maxRuleCount = 100;

export const minConsiderableStates = 1;
export const maxConsiderableStates = Math.floor(Math.sqrt(maxRuleCount));

export const minConsiderableNeighbors = 0;
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
  .andThen(whenBetweenByD(minConsiderableNeighbors, maxConsiderableNeighbors, (n) => n.length))
  .map<Neighbors>((a) => a.sort());

export const statesAndNeighborsPassMaxRuleCountCheck = <T extends StatesNeighbors>(
  a: T,
): Decoder<T> => whenByLED(maxRuleCount, (a: T) => a.states ** a.neighbors.length)(a);

export const statesAndNeighborsDecoder: Decoder<{ states: number; neighbors: Neighbors }> = succeed(
  {},
)
  .assign('states', field('states', statesDecoder))
  .assign('neighbors', field('neighbors', neighborsDecoder))
  .andThen(statesAndNeighborsPassMaxRuleCountCheck);

export const maxStates = (neighbors: Neighbors): Count => {
  const roughMax = Math.round(Math.pow(maxRuleCount, 1 / neighbors.length));
  const max = roughMax ** neighbors.length > maxRuleCount ? roughMax - 1 : roughMax;
  return Math.min(max, maxConsiderableStates);
};

export const statesPassesMaxCheck = <T extends StatesNeighbors>(a: T): Decoder<T> =>
  whenByLED(maxStates(a.neighbors), (a: T) => a.states)(a);

// states ** states ** neighbors >= ruleId
// log(states ** states ** neighbors) >= log(ruleId)
// states ** neighbors * log(states) >= log(ruleId)
//
const testSNR = (states: number, neighbors: number, ruleId: bigint): boolean =>
  states ** neighbors * Math.log10(states) >= bigLog10(ruleId);

export const minStates = (neighbors: Neighbors, ruleId: bigint): Count => {
  if (neighbors.length === 0) {
    return ruleId < BigInt(maxConsiderableStates)
      ? Number(ruleId.toString()) + 1
      : maxConsiderableStates;
  }

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

export const maxConsiderableRuleIdLength: number = Math.max(
  ...[...Array(maxConsiderableStates - minConsiderableStates + 1)]
    .map((_, i) => i + minConsiderableStates)
    .map((s) => s ** maxNeighbors(s) * Math.log10(s))
    .map((n) => 1.1 * n) // Give some buffer room
    .map(Math.floor),
);

export const minRuleId: bigint = BigInt(0);

// Decode a ruleId from a string
export const ruleIdDecoder: Decoder<bigint> = string
  .andThen((s) => whenByLED(maxConsiderableRuleIdLength, (s: string) => s.length)(s))
  .andThen(() => bigIntDecoder)
  .andThen(whenGED(minRuleId));

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

// We don't need to test the min-states or min-neighbors checks here, because
// the max-ruleId check is equivalent to both.
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

export const safeAutomataCtor = (
  states: string,
  neighbors: ReadonlyArray<number>,
  ruleId: string,
): Result<string, Automata> =>
  ok<string, { ruleId: string; neighbors: ReadonlyArray<number> }>({ ruleId, neighbors })
    .assign('states', stringToNumberDecoder.decodeAny(states))
    .andThen((a) => automataWithRuleIdDecoder.decodeAny(a));

const automataFromSerializedFields = (
  states: string,
  zigZagged: string,
  ruleId: string,
): Decoder<Automata> =>
  new Decoder(() =>
    ok<NumberParseFailure, string>(zigZagged)
      .andThen(parseIntR)
      .mapError((e) => e.message)
      .map(fromZigZagCollection)
      .andThen((neighbors) => safeAutomataCtor(states, neighbors, ruleId)),
  );

export const serializedAutomataDecoder: Decoder<Automata> = string
  .map((s) => (s[0] === '#' ? s.slice(1) : s.slice(0)))
  .map((s) => s.split('.'))
  .andThen(whenByEQD(3, (a) => a.length))
  .andThen(([states, zigZagged, ruleId]) =>
    automataFromSerializedFields(states, zigZagged, ruleId),
  );
