import { assertNever } from '@kofno/piper';
import { just, Maybe, nothing } from 'maybeasy';
import { makeObservable, computed, action, observable } from 'mobx';
import { NonEmptyList } from 'nonempty-list';
import { Automata, Generation } from '../Types';
import { State, ready, working, waiting } from './Types';

class HistoryStore {
  state: State;
  visibleEmulationWidth: number = 20; // The bit the user's window is wide enough to see
  showableEmulationWidth: number = 20; // The bit we have calculated and can show the user

  constructor(automata: Automata, public height: number) {
    this.state = waiting(automata);
    makeObservable(this, {
      state: observable,
      height: observable,
      visibleEmulationWidth: observable,
      showableEmulationWidth: observable,
      setVisibleEmulationWidth: action,
      working: action,
      ready: action,
      calcNextGeneration: action,
      automata: computed,
      first: computed,
      generations: computed,
    });
  }

  setVisibleEmulationWidth = (width: number) => {
    this.visibleEmulationWidth = width;
  };

  setShowableEmulationWidth = (width: number) => {
    this.showableEmulationWidth = width;
  };

  working = (automata: Automata, generations: NonEmptyList<Generation>): void => {
    switch (this.state.kind) {
      case 'waiting':
      case 'ready':
        this.state = working(automata, generations);
        break;
      case 'working':
        break;
      default:
        assertNever(this.state);
    }
  };

  ready = (): void => {
    switch (this.state.kind) {
      case 'waiting':
      case 'ready':
        break;
      case 'working':
        this.state = ready(this.automata, this.state.generations);
        break;
      default:
        assertNever(this.state);
    }
  };

  calcNextGeneration = (calc: (generation: Generation) => Generation): void => {
    switch (this.state.kind) {
      case 'waiting':
      case 'ready':
        break;
      case 'working':
        this.state.generations = this.state.generations.concat([
          calc(this.state.generations.toArray()[this.state.generations.length - 1]),
        ]);
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
        return nothing();
      case 'working':
      case 'ready':
        return just(this.state.generations.first);
    }
  }

  get generations(): ReadonlyArray<Generation> {
    switch (this.state.kind) {
      case 'waiting':
        return [];
      case 'working':
      case 'ready':
        return this.state.generations.toArray();
    }
  }
}

export default HistoryStore;
