import { makeObservable, computed, action, observable } from 'mobx';
import { assertNever } from '../../Assert';
import { Automata, Generation } from '../Types';
import { State, progressing, ready } from './Types';

class HistoryStore {
  state: State;

  constructor(automata: Automata, starting: Generation) {
    this.state = ready(automata, starting, []);
    makeObservable(this, {
      state: observable,
      progress: action,
      ready: action,
      automata: computed,
      current: computed,
      history: computed,
    });
  }

  progress = (): void => {
    switch (this.state.kind) {
      case 'ready':
        this.state = progressing(this.automata, this.current, this.history);
        break;
      case 'progressing':
        break;
      default:
        assertNever(this.state);
    }
  };

  ready = (next: Generation): void => {
    switch (this.state.kind) {
      case 'ready':
        break;
      case 'progressing':
        this.state = ready(this.automata, next, [...this.history, this.current]);
        break;
      default:
        assertNever(this.state);
    }
  };

  get automata() {
    return this.state.automata;
  }

  get current() {
    return this.state.current;
  }

  get history() {
    return this.state.history;
  }
}

export default HistoryStore;
