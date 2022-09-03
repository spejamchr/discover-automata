import { parseIntR } from '@execonline-inc/numbers';
import { always } from '@kofno/piper';
import { action, makeObservable, observable } from 'mobx';
import { assertNever } from '../../utils/Assert';
import { calcId, calcRules } from '../../utils/CellularAutomata';
import HistoryStore from '../../utils/CellularAutomata/HistoryStore';
import {
  Automata,
  Count,
  Generation,
  Index,
  Neighbors,
  State as CellState,
} from '../../utils/CellularAutomata/Types';
import { fromArrayResult, whenBetweenR, whenGER, whenLER } from '../../utils/Extensions';
import { ConfigError, ConfigResult, configuring, ready, State } from './Types';
import { ok } from 'resulty';

class Store {
  state: State = configuring('2', [-1, 0, 1], '110', '0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0');

  constructor() {
    makeObservable(this, {
      state: observable,
      configuring: action,
      ready: action,
      setStates: action,
      setNeighbors: action,
      setRuleId: action,
      setStarting: action,
    });
  }

  configuring = (): void => {
    switch (this.state.kind) {
      case 'configuring':
        break;
      case 'ready':
        const {
          automata: { states, neighbors, rules },
          history,
          current,
        } = this.state.history;

        this.state = configuring(
          String(states),
          neighbors.toArray(),
          String(calcId(rules, states)),
          (history[0] || current).toArray().join(','),
        );
        break;
      default:
        assertNever(this.state);
    }
  };

  private automata = (): ConfigResult<Automata> =>
    ok<ConfigError, {}>({})
      .assign('states', this.states)
      .assign('neighbors', this.neighbors)
      .assign('rules', ({ states, neighbors }) =>
        this.ruleId.map((id) => calcRules(id, states, neighbors)),
      );

  ready = (): void => {
    switch (this.state.kind) {
      case 'configuring':
        ok<ConfigError, {}>({})
          .assign('automata', this.automata)
          .assign('starting', this.starting)
          .map(({ automata, starting }) => new HistoryStore(automata, starting))
          .map(ready)
          .do((readyState) => (this.state = readyState));
        break;
      case 'ready':
        break;
      default:
        assertNever(this.state);
    }
  };

  setStates = (value: string): void => {
    switch (this.state.kind) {
      case 'configuring':
        this.state.states = value;
        break;
      case 'ready':
        break;
      default:
        assertNever(this.state);
    }
  };

  setNeighbors = (value: ReadonlyArray<Index>): void => {
    switch (this.state.kind) {
      case 'configuring':
        this.state.neighbors = value;
        break;
      case 'ready':
        break;
      default:
        assertNever(this.state);
    }
  };

  setRuleId = (value: string): void => {
    switch (this.state.kind) {
      case 'configuring':
        this.state.ruleId = value;
        break;
      case 'ready':
        break;
      default:
        assertNever(this.state);
    }
  };

  setStarting = (value: string): void => {
    switch (this.state.kind) {
      case 'configuring':
        this.state.starting = value;
        break;
      case 'ready':
        break;
      default:
        assertNever(this.state);
    }
  };

  get minStates(): Count {
    return 2;
  }

  get maxStates(): Count {
    return 36;
  }

  get maxRuleCount(): Count {
    return 10 ** 7;
  }

  private parseStates = (): ConfigResult<number> => {
    switch (this.state.kind) {
      case 'configuring':
        return ok<ConfigError, string>(this.state.states)
          .andThen(parseIntR)
          .andThen(whenBetweenR(this.minStates, this.maxStates));
      case 'ready':
        return ok(this.state.history.automata.states);
    }
  };

  private whenValidRuleCount = <T>(
    states: Count,
    neighbors: Neighbors,
    result: T,
  ): ConfigResult<T> => whenLER(this.maxRuleCount)(states ** neighbors.length).map(always(result));

  private parseNeighbors = (): ConfigResult<Neighbors> => {
    switch (this.state.kind) {
      case 'configuring':
        return fromArrayResult(this.state.neighbors).map((a) => a.sort());
      case 'ready':
        return ok(this.state.history.automata.neighbors);
    }
  };

  get states(): ConfigResult<Count> {
    return this.parseNeighbors().cata({
      Ok: (n) => this.parseStates().andThen((s) => this.whenValidRuleCount(s, n, s)),
      Err: this.parseStates,
    });
  }

  get neighbors(): ConfigResult<Neighbors> {
    return this.parseStates().cata({
      Ok: (s) => this.parseNeighbors().andThen((n) => this.whenValidRuleCount(s, n, n)),
      Err: this.parseNeighbors,
    });
  }

  get minRule(): number {
    return 0;
  }

  get maxRule(): ConfigResult<number> {
    return ok<ConfigError, {}>({})
      .assign('states', this.states)
      .assign('neighbors', this.neighbors)
      .map(({ states, neighbors }) => states ** (states ** neighbors.length) - 1);
  }

  get ruleId(): ConfigResult<number> {
    switch (this.state.kind) {
      case 'configuring':
        const state = this.state;
        return this.maxRule.cata({
          Ok: (max) =>
            ok<ConfigError, string>(state.ruleId)
              .andThen(parseIntR)
              .andThen(whenBetweenR(this.minRule, max)),
          Err: () =>
            ok<ConfigError, string>(state.ruleId).andThen(parseIntR).andThen(whenGER(this.minRule)),
        });
      case 'ready':
        return ok(calcId(this.state.history.automata.rules, this.state.history.automata.states));
    }
  }

  get starting(): ConfigResult<Generation> {
    switch (this.state.kind) {
      case 'configuring':
        const state = this.state;
        return state.starting
          .split(',')
          .map<ConfigResult<number>>(parseIntR)
          .map((r) =>
            r.andThen(
              this.states.map((states) => whenBetweenR(0, states - 1)).getOrElseValue(whenGER(0)),
            ),
          )
          .reduce(
            (ma, ms) => ma.andThen((a) => ms.map((s) => [...a, s])),
            ok<ConfigError, Array<CellState>>([]),
          )
          .andThen(fromArrayResult);
      case 'ready':
        return ok(this.state.history.history[0] || this.state.history.current);
    }
  }
}

export default Store;
