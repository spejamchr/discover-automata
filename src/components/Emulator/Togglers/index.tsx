import { observer } from 'mobx-react';
import T from '../../../utils/Locales/T';
import Button from '../../Button';
import Store from '../Store';
import { randomCells, singleCell } from '../Types';

interface Props {
  store: Store;
}

const toggleFirstGeneration = (store: Store) => (): void => {
  store.settings.firstGeneration.kind === 'random-cells'
    ? store.setFirstGeneration(singleCell())
    : store.setFirstGeneration(randomCells());
};

const Togglers: React.FC<Props> = ({ store }) => (
  <span className="inline-flex min-w-[18rem] flex-col">
    <Button className="mb-2" onClick={store.toggleShowStateLabels}>
      <T kind={store.settings.showStateLabels ? 'Showing state labels' : 'Hiding state labels'} />
    </Button>
    <Button className="mb-2" onClick={store.toggleDisplayInColor}>
      <T kind={store.settings.displayInColor ? 'Displaying in color' : 'Displaying in grayscale'} />
    </Button>
    <Button className="mb-2" onClick={toggleFirstGeneration(store)}>
      <T
        kind={
          store.settings.firstGeneration.kind === 'random-cells'
            ? 'Starting with Random Cells'
            : 'Starting with Single Cell'
        }
      />
    </Button>
  </span>
);

export default observer(Togglers);
