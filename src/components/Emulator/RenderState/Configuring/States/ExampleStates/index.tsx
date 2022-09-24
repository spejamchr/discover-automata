import { observer } from 'mobx-react-lite';
import { range } from '../../../../../../utils/Range';
import Cell from '../../../../Generations/Row/Cell';
import Store from '../../../../Store';

interface Props {
  store: Store;
}

const ExampleStates: React.FC<Props> = ({ store }) => (
  <span
    className={`ml-1 mt-[3px] box-content flex max-w-[5rem] flex-wrap border border-black bg-slate-300`}
  >
    {range(store.automata.states).map((i) => (
      <Cell key={i} state={i} colorPicker={store.colorPicker} />
    ))}
  </span>
);

export default observer(ExampleStates);