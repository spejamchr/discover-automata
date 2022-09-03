import { assertNever } from '../../utils/Assert';
import ReactionComponent from '../../utils/ReactionComponent';
import Store from './Store';
import { State } from './Types';

class Reactions extends ReactionComponent<Store, State> {
  tester = () => this.props.store.state;
  effect = (state: State) => {
    switch (state.kind) {
      case 'configuring':
        break;
      case 'ready':
        break;
      default:
        assertNever(state);
    }
  };
}

export default Reactions;
