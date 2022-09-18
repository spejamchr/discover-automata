import { parseIntR } from '@execonline-inc/numbers';
import { ok } from 'resulty';
import { ConfigResult } from '../../components/Emulator/Types';
import { bigLog10, bigPow, parseBigIntR } from '../BigIntExt';
import { whenBetweenByR, whenBetweenR, whenByGER, whenByLER, whenGER } from '../Extensions';
import {
  maxConsiderableNeighbors,
  maxConsiderableRuleIdLength,
  maxConsiderableStates,
  maxNeighborIndex,
  maxRuleCount,
  minConsiderableNeighbors,
  minConsiderableStates,
  minNeighborIndex,
  minRuleId,
} from './Decoders';
import { AutomataWithRuleId, Count, Neighbors } from './Types';

const testSNR = (states: number, neighbors: number, ruleId: bigint): boolean =>
  states ** neighbors * Math.log10(states) >= bigLog10(ruleId);

const okC = <T>(t: T): ConfigResult<T> => ok(t);

export const parseStates = (userStates: string): ConfigResult<Count> =>
  okC(userStates)
    .andThen(parseIntR)
    .andThen(whenBetweenR(minConsiderableStates, maxConsiderableStates));

export const parseNeighbors = (userNeighbors: ReadonlyArray<number>): ConfigResult<Neighbors> =>
  userNeighbors
    .map(whenBetweenR(minNeighborIndex, maxNeighborIndex))
    .reduce((r, i) => r.andThen((a) => i.map((n) => [...a, n])), okC<Array<number>>([]))
    .andThen(whenBetweenByR(minConsiderableNeighbors, maxConsiderableNeighbors, (n) => n.length))
    .map((a) => a.sort());

export const parseRuleId = (userRuleId: string): ConfigResult<bigint> =>
  okC(userRuleId)
    .andThen(whenByLER(maxConsiderableRuleIdLength, (s) => s.length))
    .andThen(parseBigIntR)
    .andThen(whenGER(minRuleId));

export const calcMaxStates = (neighbors: Neighbors): number => {
  const roughMax = Math.round(Math.pow(maxRuleCount, 1 / neighbors.length));
  const max = roughMax ** neighbors.length > maxRuleCount ? roughMax - 1 : roughMax;
  return Math.min(max, maxConsiderableStates);
};

export const calcMinStates = (a: { neighbors: Neighbors; ruleId: bigint; max: number }): number => {
  if (a.neighbors.length === 0) {
    return a.ruleId < BigInt(maxConsiderableStates)
      ? Number(a.ruleId.toString()) + 1
      : maxConsiderableStates;
  }

  let min = minConsiderableStates;
  while (!testSNR(min, a.neighbors.length, a.ruleId)) {
    min++;
  }
  return Math.min(min, a.max);
};

export const calcMaxNeighbors = (states: number): number => {
  const max = Math.round(Math.log(maxRuleCount) / Math.log(states));
  const r = states ** max > maxRuleCount ? max - 1 : max;
  return Math.min(r, maxConsiderableNeighbors);
};

export const calcMinNeighbors = (a: { states: number; ruleId: bigint; max: number }): number => {
  if (a.states === 1) return minConsiderableNeighbors;

  let min = minConsiderableNeighbors;
  while (!testSNR(a.states, min, a.ruleId)) {
    min++;
  }
  return Math.min(min, a.max);
};

export const calcMaxRuleId = (a: { states: number; neighbors: Neighbors }): ConfigResult<bigint> =>
  bigPow(BigInt(a.states), a.states ** a.neighbors.length).map((max) => max - BigInt(1));

// We don't need to test the min-states or min-neighbors checks here, because
// the max-ruleId check is equivalent to both.
export const automataWithRuleIdPassesMinMaxChecks =
  (maxStates: number, maxNeighbors: number, maxRuleId: bigint) =>
  <T extends AutomataWithRuleId>(a: T): ConfigResult<T> =>
    okC(a)
      .andThen(whenByGER(minRuleId, (a) => a.ruleId))
      .andThen(whenByLER(maxStates, (a) => a.states))
      .andThen(whenByLER(maxNeighbors, (a) => a.neighbors.length))
      .andThen(whenByLER(maxRuleId, (a) => a.ruleId));
