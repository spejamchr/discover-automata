import { always, assertNever } from '@kofno/piper';
import { NonEmptyList } from 'nonempty-list';
import HistoryStore from '.';
import { nextCellsOnZero } from '..';
import EmulatorStore from '../../../components/Emulator/Store';
import { range } from '../../Range';
import ReactionComponent from '../../ReactionComponent';
import { State } from './Types';

const negSpeedOfLight = (store: HistoryStore): number => Math.min(0, ...store.automata.neighbors);
const posSpeedOfLight = (store: HistoryStore): number => Math.max(0, ...store.automata.neighbors);

export const negBufferWidth = (store: HistoryStore): number =>
  store.height * -1 * negSpeedOfLight(store);

export const posBufferWidth = (store: HistoryStore): number =>
  store.height * posSpeedOfLight(store);

interface Props {
  visibleEmulationWidth: number;
  emulatorStore: EmulatorStore;
}

// Based on Mulberry32 found at: https://stackoverflow.com/a/47593316
export const seedablePrng = (base: number) => (): number => {
  var t = (base += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const randState = (states: number, seed: number) => {
  const prng = seedablePrng(seed * 2 ** 32);
  return () => Math.floor(prng() * states);
};

const singleCenteredCell = (width: number, states: number) => (i: number) =>
  i === Math.round(width / 2) ? states - 1 : 0;

const generationPopulator = (
  emulatorStore: EmulatorStore,
  store: HistoryStore,
  width: number,
): ((i: number) => number) => {
  const { firstGeneration } = emulatorStore.settings;
  switch (firstGeneration.kind) {
    case 'single-cell':
      return singleCenteredCell(width, store.automata.states);
    case 'random-cells':
      return randState(store.automata.states, firstGeneration.seed);
  }
};

const observableGeneration = (
  emulatorStore: EmulatorStore,
  store: HistoryStore,
  width: number,
): ReadonlyArray<number> => range(width).map(generationPopulator(emulatorStore, store, width));

class Reactions extends ReactionComponent<HistoryStore, State, Props> {
  tester = () => this.props.store.state;
  effect = (state: State): void => {
    switch (state.kind) {
      case 'waiting':
        this.props.store.setShowableEmulationWidth(this.props.visibleEmulationWidth);

        const negBuffer = range(negBufferWidth(this.props.store)).map(always(0));
        const posBuffer = range(posBufferWidth(this.props.store)).map(always(0));
        const observableGen = observableGeneration(
          this.props.emulatorStore,
          this.props.store,
          this.props.visibleEmulationWidth,
        );
        const firstGenerationA = negBuffer.concat(observableGen).concat(posBuffer);

        const firstGeneration = new NonEmptyList(firstGenerationA[0], firstGenerationA.slice(1));

        this.props.store.working(this.props.store.automata, new NonEmptyList(firstGeneration, []));
        break;
      case 'working':
        const workingRows = Math.min(12, this.props.store.height - state.generations.length);
        for (let i = 0; i < workingRows; i++) {
          this.props.store.calcNextGeneration(nextCellsOnZero(this.props.store.automata));
        }
        this.props.store.ready();
        break;
      case 'ready':
        if (state.generations.length < this.props.store.height) {
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
