import { serialize } from '../../utils/CellularAutomata';
import ReactionComponent from '../../utils/ReactionComponent';
import { windowGet } from '../../utils/WindowGet';
import Store from './Store';

class Reactions extends ReactionComponent<Store, string> {
  tester = () => serialize(this.props.store.automata);
  effect = (serialized: string) => {
    windowGet('location').do((location) => {
      if (location.hash || serialized !== '2.7.110') {
        location.hash = serialized;
      }
    });
  };
}

export default Reactions;
