import { parseIntR } from '@execonline-inc/numbers';
import { always } from '@kofno/piper';
import { action, computed, makeObservable, observable } from 'mobx';
import {
  automataCtor,
  automataCtorWithRules,
  deserializeAutomata,
  hashDecoder,
  serialize,
} from '../../utils/CellularAutomata';
import { Automata, Count, Index, Neighbors } from '../../utils/CellularAutomata/Types';
import {
  fromArrayResult,
  whenBetweenBy,
  whenBetweenR,
  whenByLER,
  whenGER,
  whenGTR,
  whenLER,
} from '../../utils/Extensions';
import { ConfigError, ConfigResult, configuring, State } from './Types';
import { ok } from 'resulty';
import { NonEmptyList } from 'nonempty-list';
import { ColorPicker, makeColorPicker } from '../../utils/ColorPicker';
import { bigPow, parseBigIntR } from '../../utils/BigIntExt';
import { windowGet } from '../../utils/WindowGet';

const firstAutomata = () =>
  ok<unknown, 'location'>('location')
    .andThen(windowGet)
    .map((l) => l.hash)
    .andThen(hashDecoder.decodeAny)
    .andThen(deserializeAutomata)
    .getOrElse(() =>
      automataCtor({
        states: 2,
        neighbors: new NonEmptyList<number>(-1, [0, 1]),
        ruleId: BigInt(110),
      }),
    );

class Store {
  state: State = configuring(firstAutomata(), false, true);

  constructor() {
    makeObservable(this, {
      state: observable,
      automata: computed,
      setAutomata: action,
      setStates: action,
      setNeighbors: action,
      setRuleId: action,
      randomizeRules: action,
      toggleShowStateLabels: action,
      toggleDisplayInColor: action,
      minStates: computed,
      maxStates: computed,
      minRuleId: computed,
      maxRuleId: computed,
      minNeighbors: computed,
      maxNeighbors: computed,
      parseStates: computed,
      parseNeighbors: computed,
      parseStatesAndNeighbors: computed,
      parseRuleId: computed,
      states: computed,
      neighbors: computed,
      ruleId: computed,
      colorPicker: computed,
    });
  }

  private setAutomataIfNeeded = (): void => {
    ok<ConfigError, {}>({})
      .assign('states', this.states)
      .assign('neighbors', this.neighbors)
      .assign('ruleId', this.ruleId)
      .do((partialAutomata) => {
        if (serialize(partialAutomata) !== serialize(this.state.automata)) {
          this.setAutomata(automataCtor(partialAutomata));
        }
      });
  };

  setAutomata = (value: Automata): void => {
    this.state = configuring(value, this.state.showStateLabels, this.state.displayInColor);
  };

  get automata(): Automata {
    return this.state.automata;
  }

  setStates = (value: string): void => {
    this.state.states = value;
    this.setAutomataIfNeeded();
  };

  setNeighbors = (value: ReadonlyArray<Index>): void => {
    this.state.neighbors = value;
    this.setAutomataIfNeeded();
  };

  setRuleId = (value: string): void => {
    this.state.ruleId = value;
    this.setAutomataIfNeeded();
  };

  randomizeRules = (): void => {
    this.parseStatesAndNeighbors
      .map((partial) => ({
        ...partial,
        rules: [...Array(partial.states ** partial.neighbors.length)].map(() =>
          Math.round(Math.random() * (partial.states - 1)),
        ),
      }))
      .andThen(automataCtorWithRules)
      .do(this.setAutomata);
  };

  toggleShowStateLabels = (): void => {
    this.state.showStateLabels = !this.state.showStateLabels;
  };

  toggleDisplayInColor = (): void => {
    this.state.displayInColor = !this.state.displayInColor;
  };

  // Arbitrary limit... we display these, so we don't want too many
  maxRuleCount: number = 100;

  maxConsiderableStates: number = Math.floor(Math.sqrt(this.maxRuleCount));

  maxConsiderableNeighbors: number = Math.floor(Math.log2(this.maxRuleCount));

  get minStates(): Count {
    return ok<ConfigError, {}>({})
      .assign('neighbors', this.parseNeighbors)
      .assign('ruleId', this.parseRuleId)
      .map(({ neighbors, ruleId }) => {
        let min = 1;
        while (!this.testSNR(min, neighbors.length, ruleId)) {
          min++;
        }
        return Math.min(min, this.maxStates);
      })
      .getOrElseValue(1);
  }

  // maxStates ** neighbors.length <= maxRuleCount
  get maxStates(): number {
    return this.parseNeighbors
      .map((n) => n.length)
      .map((n) => {
        const max = Math.round(Math.pow(this.maxRuleCount, 1 / n));
        return max ** n > this.maxRuleCount ? max - 1 : max;
      })
      .andThen(whenLER(this.maxConsiderableStates))
      .getOrElseValue(this.maxConsiderableStates);
  }

  get minRuleId(): bigint {
    return BigInt(0);
  }

  get maxRuleId(): ConfigResult<bigint> {
    return this.parseStatesAndNeighbors
      .andThen(({ states, neighbors }) => bigPow(BigInt(states), states ** neighbors.length))
      .map((max) => max - BigInt(1));
  }

  private testSNR = (states: number, neighbors: number, ruleId: bigint) =>
    ok<ConfigError, number>(states)
      .andThen(() => bigPow(BigInt(states), states ** neighbors))
      .andThen(whenGTR(ruleId))
      .map(always(true))
      .getOrElseValue(false);

  // Zero would be boring, but possible
  get minNeighbors(): Count {
    return ok<ConfigError, {}>({})
      .assign('states', this.parseStates.andThen(whenGTR(1)))
      .assign('ruleId', this.parseRuleId)
      .map(({ states, ruleId }) => {
        let min = 1;
        while (!this.testSNR(states, min, ruleId)) {
          min++;
        }
        return Math.min(min, this.maxNeighbors);
      })
      .getOrElseValue(1);
  }

  // states ** maxNeighbors <= maxRuleCount
  get maxNeighbors(): Index {
    return this.parseStates
      .map((s) => {
        const max = Math.round(Math.log(this.maxRuleCount) / Math.log(s));
        const r = s ** max > this.maxRuleCount ? max - 1 : max;
        return Math.min(r, this.maxConsiderableNeighbors);
      })
      .getOrElseValue(this.maxConsiderableNeighbors);
  }

  get parseStates(): ConfigResult<number> {
    return ok<ConfigError, string>(this.state.states)
      .andThen(parseIntR)
      .andThen(whenLER(this.maxConsiderableStates));
  }

  get parseNeighbors(): ConfigResult<Neighbors> {
    return fromArrayResult(this.state.neighbors).map((a) => a.sort());
  }

  get parseStatesAndNeighbors(): ConfigResult<{ states: number; neighbors: Neighbors }> {
    return ok<ConfigError, {}>({})
      .assign('states', this.parseStates)
      .assign('neighbors', this.parseNeighbors)
      .andThen(whenByLER(this.maxRuleCount, ({ states, neighbors }) => states ** neighbors.length));
  }

  get parseRuleId(): ConfigResult<bigint> {
    return parseBigIntR(this.state.ruleId);
  }

  get states(): ConfigResult<Count> {
    return this.parseStates.andThen(whenBetweenR(this.minStates, this.maxStates));
  }

  get neighbors(): ConfigResult<Neighbors> {
    return this.parseNeighbors.andThen(
      whenBetweenBy(this.minNeighbors, this.maxNeighbors, (n) => n.length),
    );
  }

  get ruleId(): ConfigResult<bigint> {
    return this.maxRuleId.cata({
      Ok: (max) => this.parseRuleId.andThen(whenBetweenR(this.minRuleId, max)),
      Err: () => this.parseRuleId.andThen(whenGER(this.minRuleId)),
    });
  }

  get colorPicker(): ColorPicker {
    return makeColorPicker(this);
  }
}

export default Store;
