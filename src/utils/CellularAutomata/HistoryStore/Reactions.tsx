import { noop } from '@kofno/piper';
import { NonEmptyList } from 'nonempty-list';
import Store from '.';
import { nextCellsOnZero } from '..';
import { assertNever } from '../../Assert';
import ReactionComponent from '../../ReactionComponent';
import { State } from './Types';

class Reactions extends ReactionComponent<Store, State> {
  tester = () => this.props.store.state;
  calcNextGen = nextCellsOnZero(this.props.store.automata);
  effect = (state: State) => {
    switch (state.kind) {
      case 'waiting':
        const randState = () => Math.floor(Math.random() * state.automata.states);
        const firstCell = randState();
        const rest = [...Array(99)].map(randState);
        this.props.store.working(new NonEmptyList(firstCell, rest));
        break;
      case 'working':
        state.cancel = state.task.fork(noop, this.props.store.ready);
        break;
      case 'ready':
        break;
      default:
        assertNever(state);
    }
  };
}

export default Reactions;
