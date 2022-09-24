import { always } from '@kofno/piper';
import { NonEmptyList } from 'nonempty-list';
import HistoryStore from '.';
import { nextCellsOnZero } from '..';
import { assertNever } from '../../Assert';
import { range } from '../../Range';
import ReactionComponent from '../../ReactionComponent';
import { State } from './Types';

export const visibleEmulationWidth = 100;
export const emulationGenerations = 60;

const negSpeedOfLight = (store: HistoryStore): number => Math.min(0, ...store.automata.neighbors);
const posSpeedOfLight = (store: HistoryStore): number => Math.max(0, ...store.automata.neighbors);

export const negBufferWidth = (store: HistoryStore): number =>
  emulationGenerations * -1 * negSpeedOfLight(store);

export const posBufferWidth = (store: HistoryStore): number =>
  emulationGenerations * posSpeedOfLight(store);

class Reactions extends ReactionComponent<HistoryStore, State> {
  tester = () => this.props.store.state;
  effect = (state: State) => {
    switch (state.kind) {
      case 'waiting':
        const randState = () => Math.floor(Math.random() * state.automata.states);

        const negBuffer = range(negBufferWidth(this.props.store)).map(always(0));
        const posBuffer = range(posBufferWidth(this.props.store)).map(always(0));
        const randGen = range(visibleEmulationWidth).map(randState);
        const firstGenerationA = negBuffer.concat(randGen).concat(posBuffer);

        const firstGeneration = new NonEmptyList(firstGenerationA[0], firstGenerationA.slice(1));

        this.props.store.working(this.props.store.automata, new NonEmptyList(firstGeneration, []));
        break;
      case 'working':
        this.props.store.calcNextGeneration(nextCellsOnZero(this.props.store.automata));
        this.props.store.ready();
        break;
      case 'ready':
        if (state.generations.length < emulationGenerations) {
          // Break the work into chunks so that we don't hog the thread
          setTimeout(() => this.props.store.working(state.automata, state.generations), 5);
        }
        break;
      default:
        assertNever(state);
    }
  };
}

export default Reactions;
