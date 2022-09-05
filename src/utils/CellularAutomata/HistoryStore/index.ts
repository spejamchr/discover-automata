import { just, Maybe, nothing } from 'maybeasy';
import { makeObservable, computed, action, observable } from 'mobx';
import { assertNever } from '../../Assert';
import { Automata, Generation } from '../Types';
import { State, ready, working, waiting } from './Types';

class HistoryStore {
  state: State;

  constructor(automata: Automata) {
    this.state = waiting(automata);
    makeObservable(this, {
      state: observable,
      working: action,
      ready: action,
      automata: computed,
      first: computed,
      generations: computed,
    });
  }

  working = (): void => {
    switch (this.state.kind) {
      case 'waiting':
        this.state = working(this.state.automata, []);
        break;
      case 'ready':
        // TODO: This doesn't currently run, because the store isn't reused
        // between different automata
        this.state = working(this.state.automata, this.state.generations);
        break;
      case 'working':
        break;
      default:
        assertNever(this.state);
    }
  };

  ready = (history: ReadonlyArray<Generation>): void => {
    switch (this.state.kind) {
      case 'waiting':
      case 'ready':
        break;
      case 'working':
        this.state = ready(this.automata, history);
        break;
      default:
        assertNever(this.state);
    }
  };

  get automata(): Automata {
    return this.state.automata;
  }

  get first(): Maybe<Generation> {
    switch (this.state.kind) {
      case 'waiting':
      case 'working':
        return nothing();
      case 'ready':
        return just(this.state.generations[0]);
    }
  }

  get generations(): ReadonlyArray<Generation> {
    switch (this.state.kind) {
      case 'waiting':
        return [];
      case 'working':
        return this.state.previousGenerations;
      case 'ready':
        return this.state.generations;
    }
  }
}

export default HistoryStore;
