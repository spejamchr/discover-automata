import { action, computed, makeObservable, observable } from 'mobx';
import { automataCtor, serialize } from '../../utils/CellularAutomata';
import { Automata, Count, Index, Neighbors } from '../../utils/CellularAutomata/Types';
import { ok } from 'resulty';
import { NonEmptyList } from 'nonempty-list';
import { ColorPicker, makeColorPicker } from '../../utils/ColorPicker';
import { windowGet } from '../../utils/WindowGet';
import {
  maxRuleCount,
  minRuleId,
  serializedAutomataDecoder,
} from '../../utils/CellularAutomata/Decoders';
import { warn } from '@execonline-inc/logging';
import { whenByLER } from '../../utils/Extensions';
import {
  automataWithRuleIdPassesMinMaxChecks,
  calcMaxNeighbors,
  calcMaxRuleId,
  calcMaxStates,
  calcMinNeighbors,
  calcMinStates,
  parseNeighbors,
  parseRuleId,
  parseStates,
} from '../../utils/CellularAutomata/Parser';
import { ConfigError, ConfigResult } from './Types';
import { fromBaseBig } from '../../utils/IntBase';

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

export interface UserAutomataPieces {
  states: string;
  neighbors: ReadonlyArray<number>;
  ruleId: string;
}

class Store {
  automata: Automata = firstAutomata();
  userStates: string = this.automata.states.toString();
  userNeighbors: ReadonlyArray<number> = this.automata.neighbors.toArray();
  userRuleId: string = this.automata.ruleId.toString();
  showStateLabels: boolean = false;
  displayInColor: boolean = true;

  constructor() {
    makeObservable(this, {
      userStates: observable,
      userNeighbors: observable,
      userRuleId: observable,
      showStateLabels: observable,
      displayInColor: observable,
      automata: observable,
      userAutomataPieces: computed,
      setAutomataIfNeeded: action,
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

  get userAutomataPieces(): UserAutomataPieces {
    return {
      states: this.userStates,
      neighbors: this.userNeighbors,
      ruleId: this.userRuleId,
    };
  }

  setAutomataIfNeeded = (): ConfigResult<Automata> => {
    return this.parseAutomata.do((automata) => {
      if (serialize(automata) !== serialize(this.automata)) {
        this.setAutomata(automata);
      }
    });
  };

  setAutomata = (value: Automata): void => {
    this.automata = value;
  };

  setStates = (value: string): void => {
    this.userStates = value;
  };

  setNeighbors = (value: ReadonlyArray<Index>): void => {
    this.userNeighbors = value;
  };

  setRuleId = (value: string): void => {
    this.userRuleId = value;
  };

  randomizeRules = (): void => {
    this.parseStatesAndNeighbors
      .andThen((partial) =>
        fromBaseBig({
          kind: 'big-int-base',
          base: partial.states,
          digits: [...Array(partial.states ** partial.neighbors.length)].map(() =>
            Math.round(Math.random() * (partial.states - 1)),
          ),
        }),
      )
      .map(String)
      .do(this.setRuleId);
  };

  toggleShowStateLabels = (): void => {
    this.showStateLabels = !this.showStateLabels;
  };

  toggleDisplayInColor = (): void => {
    this.displayInColor = !this.displayInColor;
  };

  get parseStates(): ConfigResult<Count> {
    return parseStates(this.userStates);
  }

  get parseNeighbors(): ConfigResult<Neighbors> {
    return parseNeighbors(this.userNeighbors);
  }

  get parseStatesAndNeighbors(): ConfigResult<{ states: number; neighbors: Neighbors }> {
    return ok<ConfigError, {}>({})
      .assign('states', this.parseStates)
      .assign('neighbors', this.parseNeighbors)
      .andThen(whenByLER(maxRuleCount, (a) => a.states ** a.neighbors.length));
  }

  get parseRuleId(): ConfigResult<bigint> {
    return parseRuleId(this.userRuleId);
  }

  get parseAutomata(): ConfigResult<Automata> {
    return this.parseStatesAndNeighbors
      .assign('ruleId', this.parseRuleId)
      .andThen((a) =>
        this.maxRuleId.andThen((maxRuleId) =>
          automataWithRuleIdPassesMinMaxChecks(this.maxStates, this.maxNeighbors, maxRuleId)(a),
        ),
      )
      .map(automataCtor);
  }

  get states(): ConfigResult<Count> {
    return this.parseAutomata.map((a) => a.states);
  }

  get neighbors(): ConfigResult<Neighbors> {
    return this.parseAutomata.map((a) => a.neighbors);
  }

  get ruleId(): ConfigResult<bigint> {
    return this.parseAutomata.map((a) => a.ruleId);
  }

  get colorPicker(): ColorPicker {
    return makeColorPicker(this);
  }

  get maxStates(): number {
    return calcMaxStates(this.parseNeighbors.getOrElseValue(this.automata.neighbors));
  }

  get minStates(): number {
    return calcMinStates({
      max: this.maxStates,
      neighbors: this.parseNeighbors.getOrElseValue(this.automata.neighbors),
      ruleId: this.parseRuleId.getOrElseValue(this.automata.ruleId),
    });
  }

  get maxNeighbors(): number {
    return calcMaxNeighbors(this.parseStates.getOrElseValue(this.automata.states));
  }

  get minNeighbors(): number {
    return calcMinNeighbors({
      max: this.maxNeighbors,
      states: this.parseStates.getOrElseValue(this.automata.states),
      ruleId: this.parseRuleId.getOrElseValue(this.automata.ruleId),
    });
  }

  get minRuleId(): bigint {
    return minRuleId;
  }

  get maxRuleId(): ConfigResult<bigint> {
    return calcMaxRuleId({
      states: this.parseStates.getOrElseValue(this.automata.states),
      neighbors: this.parseNeighbors.getOrElseValue(this.automata.neighbors),
    });
  }
}

export default Store;
