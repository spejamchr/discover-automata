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
import { fromArrayResult, whenBetweenR, whenGER } from '../../utils/Extensions';
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
    switch (this.state.kind) {
      case 'configuring':
        return ok<ConfigError, string>(this.state.states).andThen(parseIntR);
      case 'ready':
        return ok(this.state.history.automata.states);
    }
  };

  private parseNeighbors = (): ConfigResult<Neighbors> => {
    switch (this.state.kind) {
      case 'configuring':
        return fromArrayResult(this.state.neighbors).map((a) => a.sort());
      case 'ready':
        return ok(this.state.history.automata.neighbors);
    }
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
    switch (this.state.kind) {
      case 'configuring':
        const state = this.state;
        return this.maxRuleId.cata({
          Ok: (max) =>
            ok<ConfigError, string>(state.ruleId)
              .andThen(parseIntR)
              .andThen(whenBetweenR(this.minRuleId, max)),
          Err: () =>
            ok<ConfigError, string>(state.ruleId)
              .andThen(parseIntR)
              .andThen(whenGER(this.minRuleId)),
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
