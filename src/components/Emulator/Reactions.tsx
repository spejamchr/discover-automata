import { serialize } from '../../utils/CellularAutomata';
import ReactionComponent from '../../utils/ReactionComponent';
import Store from './Store';

class Reactions extends ReactionComponent<Store, string> {
  tester = () => serialize(this.props.store.automata);
  effect = (serialized: string) => {
    window.location.hash = serialized;
  };
}

export default Reactions;
