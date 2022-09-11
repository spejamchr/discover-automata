import { NonEmptyList } from 'nonempty-list';
import Store from '.';
import { nextCellsOnZero } from '..';
import { assertNever } from '../../Assert';
import ReactionComponent from '../../ReactionComponent';
import { State } from './Types';

class Reactions extends ReactionComponent<Store, State['kind']> {
  tester = () => this.props.store.state.kind;
  effect = () => {
    const { state } = this.props.store;
    switch (state.kind) {
      case 'waiting':
        this.props.store.working(this.props.store.automata);
        break;
      case 'working':
        const randState = () => Math.floor(Math.random() * state.automata.states);
        const firstCell = randState();
        const rest = [...Array(99)].map(randState);
        const first = new NonEmptyList(firstCell, rest);
        const generations = [first];
        const calcNextGen = nextCellsOnZero(this.props.store.automata);

        for (let i = 0; i < 100; i++) {
          generations.push(calcNextGen(generations[i]));
        }
        this.props.store.ready(generations);
        break;
      case 'ready':
        break;
      default:
        assertNever(state);
    }
  };
}

export default Reactions;
