import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../utils/CellularAutomata/HistoryStore';
import { State } from '../../../utils/CellularAutomata/Types';
import Row from './Row';

interface Props {
  historyStore: HistoryStore;
  colorPicker: (state: State) => string;
}

const Generations: React.FC<Props> = ({ historyStore, colorPicker }) => (
  <table className={`w-full`}>
    <tbody>
      {historyStore.generations.map((g, i) => (
        <Row key={i} row={g} colorPicker={colorPicker} />
      ))}
    </tbody>
  </table>
);

export default observer(Generations);
