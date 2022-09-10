import { action, computed, makeObservable, observable } from 'mobx';
import { automataCtor, serialize } from '../../utils/CellularAutomata';
import { Automata, Count, Index, Neighbors } from '../../utils/CellularAutomata/Types';
import { fromNullable, ok } from 'resulty';
import { NonEmptyList } from 'nonempty-list';
import { ColorPicker, makeColorPicker } from '../../utils/ColorPicker';
import { windowGet } from '../../utils/WindowGet';
import {
  maxRuleIdPerValidStateNeighbor,
  minConsiderableNeighbors,
  minConsiderableStates,
  minRuleId,
  serializedAutomataDecoder,
} from '../../utils/CellularAutomata/Decoders';
import { warn } from '@execonline-inc/logging';
import {
  automataWithRuleIdPassesMinMaxChecks,
  calcMaxNeighbors,
  calcMaxStates,
  parseRuleId,
} from '../../utils/CellularAutomata/Parser';
import { ConfigResult } from './Types';
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
    this.setAutomataIfNeeded();
  };

  setNeighbors = (value: ReadonlyArray<Index>): void => {
    this.userNeighbors = value;
    this.setAutomataIfNeeded();
  };

  setRuleId = (value: string): void => {
    this.userRuleId = value;
    this.setAutomataIfNeeded();
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

  get parseStatesAndNeighbors(): ConfigResult<{ states: number; neighbors: Neighbors }> {
    return this.maxRuleId.map(() => ({
      states: Number(this.userStates),
      neighbors: new NonEmptyList(this.userNeighbors[0], this.userNeighbors.slice(1)),
    }));
  }

  get parseStates(): ConfigResult<Count> {
    return this.parseStatesAndNeighbors.map(({ states }) => states);
  }

  get parseNeighbors(): ConfigResult<Neighbors> {
    return this.parseStatesAndNeighbors.map(({ neighbors }) => neighbors);
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
    return minConsiderableStates;
  }

  get maxNeighbors(): number {
    return calcMaxNeighbors(this.parseStates.getOrElseValue(this.automata.states));
  }

  get minNeighbors(): number {
    return minConsiderableNeighbors;
  }

  get minRuleId(): bigint {
    return minRuleId;
  }

  get maxRuleId(): ConfigResult<bigint> {
    return fromNullable(
      { kind: 'overflow-error' },
      maxRuleIdPerValidStateNeighbor.get(`<${this.userStates}:${this.userNeighbors.length}>`),
    );
  }
}

export default Store;
