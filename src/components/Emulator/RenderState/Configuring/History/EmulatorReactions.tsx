import ReactionComponent from '../../../../../utils/ReactionComponent';
import Store, { UserAutomataPieces } from '../../../Store';

interface Props {}

class EmulatorReactions extends ReactionComponent<Store, UserAutomataPieces, Props> {
  tester = () => this.props.store.userAutomataPieces;
  effect = () => {
    this.props.store.setAutomataIfNeeded();
  };
}

export default EmulatorReactions;
