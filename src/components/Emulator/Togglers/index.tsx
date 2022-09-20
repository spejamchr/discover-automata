import { observer } from 'mobx-react';
import T from '../../../utils/Locales/T';
import Button from '../../Button';
import Store from '../Store';

interface Props {
  store: Store;
}

const Togglers: React.FC<Props> = ({ store }) => (
  <span>
    <Button onClick={store.toggleShowStateLabels}>
      <T kind={store.showStateLabels ? 'Showing state labels' : 'Hiding state labels'} />
    </Button>
    <Button onClick={store.toggleDisplayInColor}>
      <T kind={store.displayInColor ? 'Displaying in color' : 'Displaying in grayscale'} />
    </Button>
  </span>
);

export default observer(Togglers);
