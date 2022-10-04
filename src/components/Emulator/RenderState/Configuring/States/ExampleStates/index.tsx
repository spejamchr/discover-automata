import { observer } from 'mobx-react-lite';
import { range } from '../../../../../../utils/Range';
import Cell from '../../../../Generations/Row/Cell';
import Store from '../../../../Store';

interface Props {
  store: Store;
}

const ExampleStates: React.FC<Props> = ({ store }) => (
  <span
    className={`ml-1 box-content inline-flex w-fit border border-slate-700 bg-slate-300 dark:border-slate-500 dark:bg-slate-600`}
  >
    {range(store.automata.states).map((i) => (
      <Cell key={i} state={i} colorPicker={store.colorPicker} />
    ))}
  </span>
);

export default observer(ExampleStates);
