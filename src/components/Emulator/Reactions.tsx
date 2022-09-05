import ReactionComponent from '../../utils/ReactionComponent';
import Store from './Store';
import { ConfigResult } from './Types';

class Reactions extends ReactionComponent<Store, ConfigResult<string>> {
  tester = () => this.props.store.serialized;
  effect = (serialized: ConfigResult<string>) => {
    serialized
      .do((id) => (window.location.hash = id))
      .elseDo(() =>
        history.replaceState({}, document.title, window.location.pathname + window.location.search),
      );
  };
}

export default Reactions;
