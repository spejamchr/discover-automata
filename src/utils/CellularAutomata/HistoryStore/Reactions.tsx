import { NonEmptyList } from 'nonempty-list';
import Store from '.';
import { nextCellsOnZero } from '..';
import { assertNever } from '../../Assert';
import ReactionComponent from '../../ReactionComponent';
import { State } from './Types';

class Reactions extends ReactionComponent<Store, State> {
  tester = () => this.props.store.state;
  effect = (state: State) => {
    switch (state.kind) {
      case 'waiting':
        const randState = () => Math.floor(Math.random() * state.automata.states);
        const firstGeneration = new NonEmptyList(randState(), [...Array(99)].map(randState));
        this.props.store.working(this.props.store.automata, new NonEmptyList(firstGeneration, []));
        break;
      case 'working':
        this.props.store.calcNextGeneration(nextCellsOnZero(this.props.store.automata));
        this.props.store.ready();
        break;
      case 'ready':
        if (state.generations.length < 99) {
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
