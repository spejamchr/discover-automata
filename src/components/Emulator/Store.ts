import { action, computed, makeObservable, observable } from 'mobx';
import { automataCtor, automataCtorWithRules, serialize } from '../../utils/CellularAutomata';
import { Automata, Count, Index, Neighbors } from '../../utils/CellularAutomata/Types';
import { configuring, State } from './Types';
import { ok, Result } from 'resulty';
import { NonEmptyList } from 'nonempty-list';
import { ColorPicker, makeColorPicker } from '../../utils/ColorPicker';
import { windowGet } from '../../utils/WindowGet';
import {
  maxNeighbors,
  maxRuleId,
  maxStates,
  minNeighbors,
  minRuleId,
  minStates,
  neighborsDecoder,
  ruleIdDecoder,
  safeAutomataCtor,
  serializedAutomataDecoder,
  statesAndNeighborsDecoder,
  statesDecoder,
} from '../../utils/CellularAutomata/Decoders';
import { warn } from '@execonline-inc/logging';

const firstAutomata = () =>
  ok<unknown, 'location'>('location')
    .andThen(windowGet)
    .map((l) => l.hash)
    .andThen(serializedAutomataDecoder.decodeAny)
    .mapError((s) => `Error deserializing automata from hash: ${s}`)
    .elseDo(warn)
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
      minNeighbors: computed,
      maxNeighbors: computed,
      minRuleId: computed,
      maxRuleId: computed,
      parseStates: computed,
      parseNeighbors: computed,
      parseStatesAndNeighbors: computed,
      parseRuleId: computed,
      states: computed,
      neighbors: computed,
      ruleId: computed,
      colorPicker: computed,
      parseAutomata: computed,
    });
  }

  private setAutomataIfNeeded = (): void => {
    this.parseAutomata.do((automata) => {
      if (serialize(automata) !== serialize(this.state.automata)) {
        this.setAutomata(automata);
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
      .andThen((o) => automataCtorWithRules(o).mapError((e) => e.kind))
      .do(this.setAutomata);
  };

  toggleShowStateLabels = (): void => {
    this.state.showStateLabels = !this.state.showStateLabels;
  };

  toggleDisplayInColor = (): void => {
    this.state.displayInColor = !this.state.displayInColor;
  };

  get parseStates(): Result<string, number> {
    return statesDecoder.decodeAny(this.state.states);
  }

  get parseNeighbors(): Result<string, Neighbors> {
    return neighborsDecoder.decodeAny(this.state.neighbors);
  }

  get parseStatesAndNeighbors(): Result<string, { states: number; neighbors: Neighbors }> {
    return statesAndNeighborsDecoder.decodeAny(this.state);
  }

  get parseRuleId(): Result<string, bigint> {
    return ruleIdDecoder.decodeAny(this.state.ruleId);
  }

  get parseAutomata(): Result<string, Automata> {
    return safeAutomataCtor(this.state.states, this.state.neighbors, this.state.ruleId);
  }

  get states(): Result<string, Count> {
    return this.parseAutomata.map((a) => a.states);
  }

  get neighbors(): Result<string, Neighbors> {
    return this.parseAutomata.map((a) => a.neighbors);
  }

  get ruleId(): Result<string, bigint> {
    return this.parseAutomata.map((a) => a.ruleId);
  }

  get colorPicker(): ColorPicker {
    return makeColorPicker(this);
  }

  get minStates(): number {
    return minStates(
      this.parseNeighbors.getOrElseValue(this.automata.neighbors),
      this.parseRuleId.getOrElseValue(this.automata.ruleId),
    );
  }

  get maxStates(): number {
    return maxStates(this.parseNeighbors.getOrElseValue(this.automata.neighbors));
  }

  get minNeighbors(): number {
    return minNeighbors(
      this.parseStates.getOrElseValue(this.automata.states),
      this.parseRuleId.getOrElseValue(this.automata.ruleId),
    );
  }

  get maxNeighbors(): number {
    return maxNeighbors(this.parseStates.getOrElseValue(this.automata.states));
  }

  get minRuleId(): bigint {
    return minRuleId;
  }

  get maxRuleId(): Result<string, bigint> {
    return maxRuleId(
      this.parseStates.getOrElseValue(this.automata.states),
      this.parseNeighbors.getOrElseValue(this.automata.neighbors),
    );
  }
}

export default Store;
