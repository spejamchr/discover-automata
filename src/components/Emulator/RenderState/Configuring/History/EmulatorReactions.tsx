import { serialize } from '../../../../../utils/CellularAutomata';
import HistoryStore from '../../../../../utils/CellularAutomata/HistoryStore';
import ReactionComponent from '../../../../../utils/ReactionComponent';
import Store from '../../../Store';

interface Props {
  historyStore: HistoryStore;
}

class EmulatorReactions extends ReactionComponent<Store, string, Props> {
  tester = () => serialize(this.props.store.automata);
  effect = () => {
    this.props.historyStore.working(this.props.store.automata);
  };
}

export default EmulatorReactions;
