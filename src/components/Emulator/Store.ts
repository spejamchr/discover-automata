import { parseIntR } from '@execonline-inc/numbers';
import { always } from '@kofno/piper';
import { action, computed, makeObservable, observable } from 'mobx';
import { automataCtor, serialize } from '../../utils/CellularAutomata';
import HistoryStore from '../../utils/CellularAutomata/HistoryStore';
import { Automata, Count, Index, Neighbors } from '../../utils/CellularAutomata/Types';
import { fromArrayResult, whenBetweenR, whenGER } from '../../utils/Extensions';
import { ConfigError, ConfigResult, configuring, State } from './Types';
import { ok } from 'resulty';

class Store {
  state: State = configuring('2', [-1, 0, 1], '110');

  constructor() {
    makeObservable(this, {
      state: observable,
      automata: computed,
      serialized: computed,
      setStates: action,
      setNeighbors: action,
      setRuleId: action,
      minStates: computed,
      maxStates: computed,
      maxRuleCount: computed,
      minRuleId: computed,
      maxAccurateRuleId: computed,
      maxRuleId: computed,
      minNeighbors: computed,
      maxNeighbors: computed,
      states: computed,
      neighbors: computed,
      ruleId: computed,
      historyStore: computed,
    });
  }

  get automata(): ConfigResult<Automata> {
    return ok<ConfigError, {}>({})
      .assign('states', this.states)
      .assign('neighbors', this.neighbors)
      .assign('ruleId', this.ruleId)
      .map(automataCtor);
  }

  get serialized(): ConfigResult<string> {
    return this.automata.map(serialize);
  }

  setStates = (value: string): void => {
    this.state.states = value;
  };

  setNeighbors = (value: ReadonlyArray<Index>): void => {
    this.state.neighbors = value;
  };

  setRuleId = (value: string): void => {
    this.state.ruleId = value;
  };

  // One state is boring but technically possible
  get minStates(): Count {
    return 1;
  }

  // maxStates ** neighbors.length <= maxRuleCount
  get maxStates(): ConfigResult<number> {
    return this.parseNeighbors()
      .map((n) => n.length)
      .map((n) => {
        const max = Math.round(Math.pow(10 ** 7, 1 / n));
        return max ** n > this.maxRuleCount ? max - 1 : max;
      });
  }

  // Arbitrary limit... this is the size of the array of rules we have to
  // store, so we don't want it to be "too big," whatever that is.
  get maxRuleCount(): Count {
    return 10 ** 7;
  }

  get minRuleId(): Index {
    return 0;
  }

  // A RuleID encodes a unique automata as a rule array in a single integer.
  // It's not much use if that integer can't be stored accurately.
  //
  // states ** (states ** neighbors.length) <= maxAccurateRuleId
  get maxAccurateRuleId(): number {
    return Number.MAX_SAFE_INTEGER;
  }

  get maxRuleId(): ConfigResult<Index> {
    return ok<ConfigError, {}>({})
      .assign('states', this.parseStates)
      .assign('neighbors', this.parseNeighbors)
      .map(({ states, neighbors }) => states ** (states ** neighbors.length) - 1)
      .map((m) => Math.min(m, this.maxAccurateRuleId));
  }

  // Zero would be boring, but possible
  get minNeighbors(): Count {
    return 1;
  }

  // states ** maxNeighbors <= maxRuleCount
  get maxNeighbors(): ConfigResult<Index> {
    return this.parseStates().map((s) => {
      const max = Math.round(Math.log(this.maxRuleCount) / Math.log(s));
      return s ** max > this.maxRuleCount ? max - 1 : max;
    });
  }

  private parseStates = (): ConfigResult<number> => {
    return ok<ConfigError, string>(this.state.states).andThen(parseIntR);
  };

  private parseNeighbors = (): ConfigResult<Neighbors> => {
    return fromArrayResult(this.state.neighbors).map((a) => a.sort());
  };

  get states(): ConfigResult<Count> {
    return this.parseStates().andThen(
      this.maxStates
        .map((max) => whenBetweenR(this.minStates, max))
        .getOrElseValue(whenGER(this.minStates)),
    );
  }

  get neighbors(): ConfigResult<Neighbors> {
    return this.parseNeighbors().andThen((n) => {
      const compare = this.maxNeighbors
        .map((max) => whenBetweenR(this.minNeighbors, max))
        .getOrElseValue(whenGER(this.minNeighbors));
      return compare(n.length).map(always(n));
    });
  }

  get ruleId(): ConfigResult<number> {
    const state = this.state;
    return this.maxRuleId.cata({
      Ok: (max) =>
        ok<ConfigError, string>(state.ruleId)
          .andThen(parseIntR)
          .andThen(whenBetweenR(this.minRuleId, max)),
      Err: () =>
        ok<ConfigError, string>(state.ruleId).andThen(parseIntR).andThen(whenGER(this.minRuleId)),
    });
  }

  get historyStore(): ConfigResult<HistoryStore> {
    return this.automata.map((automata) => new HistoryStore(automata));
  }
}

export default Store;
