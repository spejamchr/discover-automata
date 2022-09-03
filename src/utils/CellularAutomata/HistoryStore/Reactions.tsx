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
      case 'ready':
        break;
      case 'progressing':
        this.props.store.ready(this.calcNextGen(state.current));
        break;
      default:
        assertNever(state);
    }
  };
}

export default Reactions;
