import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../utils/CellularAutomata/HistoryStore';
import { ColorPicker } from '../../../utils/ColorPicker';
import Row from './Row';

interface Props {
  historyStore: HistoryStore;
  colorPicker: ColorPicker;
}

const Generations: React.FC<Props> = ({ historyStore, colorPicker }) => (
  <div>
    {historyStore.generations.map((g, i) => (
      <Row key={i} row={g} colorPicker={colorPicker} />
    ))}
  </div>
);

export default observer(Generations);
