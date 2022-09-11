import HistoryStore from '../../../../../utils/CellularAutomata/HistoryStore';
import ReactionComponent from '../../../../../utils/ReactionComponent';
import Store, { UserAutomataPieces } from '../../../Store';

interface Props {
  historyStore: HistoryStore;
}

class EmulatorReactions extends ReactionComponent<Store, UserAutomataPieces, Props> {
  tester = () => this.props.store.userAutomataPieces;
  effect = () => {
    this.props.store.setAutomataIfNeeded().do(this.props.historyStore.working);
  };
}

export default EmulatorReactions;
