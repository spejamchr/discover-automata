import { parseIntR } from '@execonline-inc/numbers';
import { always } from '@kofno/piper';
import { action, computed, makeObservable, observable } from 'mobx';
import { automataCtor, automataCtorWithRules, serialize } from '../../utils/CellularAutomata';
import { Automata, Count, Index, Neighbors } from '../../utils/CellularAutomata/Types';
import { fromArrayResult, whenBetweenR, whenGER, whenGTR, whenLER } from '../../utils/Extensions';
import { ConfigError, ConfigResult, configuring, State } from './Types';
import { ok } from 'resulty';
import { NonEmptyList } from 'nonempty-list';
import { ColorPicker, makeColorPicker } from '../../utils/ColorPicker';
import { bigPow, parseBigIntR } from '../../utils/BigIntExt';

const rule110 = automataCtor({
  states: 2,
  neighbors: new NonEmptyList<number>(-1, [0, 1]),
  ruleId: BigInt(110),
});

class Store {
  state: State = configuring(rule110, false, true);

  constructor() {
    makeObservable(this, {
      state: observable,
      automata: computed,
      setStates: action,
      setNeighbors: action,
      setRuleId: action,
      randomizeRules: action,
      toggleShowStateLabels: action,
      toggleDisplayInColor: action,
      minStates: computed,
      maxStates: computed,
      maxRuleCount: computed,
      minRuleId: computed,
      maxRuleId: computed,
      minNeighbors: computed,
      maxNeighbors: computed,
      parseStates: computed,
      parseNeighbors: computed,
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
          this.state.automata = automataCtor(partialAutomata);
        }
      });
  };

  get automata(): Automata {
    return this.state.automata;
  }

  setStates = (value: string): void => {
    this.state.states = value;
    this.parseStates.andThen(whenLER(this.maxRuleCount)).do(this.setAutomataIfNeeded);
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
    ok<ConfigError, {}>({})
      .assign('states', this.states)
      .assign('neighbors', this.neighbors)
      .assign('rules', ({ states }) =>
        ok(this.state.automata.rules.map(() => Math.round(Math.random()) * (states - 1))),
      )
      .andThen(automataCtorWithRules)
      .do((automata) => {
        this.state.automata = automata;
        this.state.ruleId = String(automata.ruleId);
      });
  };

  toggleShowStateLabels = (): void => {
    this.state.showStateLabels = !this.state.showStateLabels;
  };

  toggleDisplayInColor = (): void => {
    this.state.displayInColor = !this.state.displayInColor;
  };

  get minStates(): Count {
    return ok<ConfigError, {}>({})
      .assign('neighbors', this.parseNeighbors)
      .assign('ruleId', this.parseRuleId)
      .map(({ neighbors, ruleId }) => {
        let min = 1;
        while (!this.testSNR(min, neighbors.length, ruleId)) {
          min++;
        }
        return min;
      })
      .getOrElseValue(1);
  }

  // maxStates ** neighbors.length <= maxRuleCount
  get maxStates(): ConfigResult<number> {
    return this.parseNeighbors
      .map((n) => n.length)
      .map((n) => {
        const max = Math.round(Math.pow(this.maxRuleCount, 1 / n));
        return max ** n > this.maxRuleCount ? max - 1 : max;
      });
  }

  // Arbitrary limit... we display these, so we don't want too many
  get maxRuleCount(): Count {
    return 100;
  }

  get minRuleId(): bigint {
    return BigInt(0);
  }

  get maxRuleId(): ConfigResult<bigint> {
    return ok<ConfigError, { states: number }>({ states: this.automata.states })
      .assign('neighbors', this.parseNeighbors)
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
      .assign('states', this.states.andThen(whenGTR(1)))
      .assign('ruleId', this.parseRuleId)
      .map(({ states, ruleId }) => {
        let min = 1;
        while (!this.testSNR(states, min, ruleId)) {
          min++;
        }
        return min;
      })
      .getOrElseValue(1);
  }

  // states ** maxNeighbors <= maxRuleCount
  get maxNeighbors(): ConfigResult<Index> {
    return this.parseStates.andThen(whenGER(this.minStates)).map((s) => {
      const max = Math.round(Math.log(this.maxRuleCount) / Math.log(s));
      const r = s ** max > this.maxRuleCount ? max - 1 : max;
      return Math.min(r, 7);
    });
  }

  get parseStates(): ConfigResult<number> {
    return parseIntR(this.state.states);
  }

  get parseNeighbors(): ConfigResult<Neighbors> {
    return fromArrayResult(this.state.neighbors).map((a) => a.sort());
  }

  get parseRuleId(): ConfigResult<bigint> {
    return parseBigIntR(this.state.ruleId);
  }

  get states(): ConfigResult<Count> {
    return this.parseStates.andThen(
      this.maxStates
        .map((max) => whenBetweenR(this.minStates, max))
        .getOrElseValue(whenGER(this.minStates)),
    );
  }

  get neighbors(): ConfigResult<Neighbors> {
    return this.parseNeighbors.andThen((n) => {
      const compare = this.maxNeighbors
        .map((max) => whenBetweenR(this.minNeighbors, max))
        .getOrElseValue(whenGER(this.minNeighbors));
      return compare(n.length).map(always(n));
    });
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
