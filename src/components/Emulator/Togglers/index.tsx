import { observer } from 'mobx-react';
import T from '../../../utils/Locales/T';
import Button from '../../Button';
import Store from '../Store';

interface Props {
  store: Store;
}

const Togglers: React.FC<Props> = ({ store }) => (
  <span className="inline-flex min-w-[15rem] flex-col">
    <Button className="mb-2" onClick={store.toggleShowStateLabels}>
      <T kind={store.showStateLabels ? 'Showing state labels' : 'Hiding state labels'} />
    </Button>
    <Button className="mb-2" onClick={store.toggleDisplayInColor}>
      <T kind={store.displayInColor ? 'Displaying in color' : 'Displaying in grayscale'} />
    </Button>
  </span>
);

export default observer(Togglers);
