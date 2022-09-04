import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../../../utils/CellularAutomata/HistoryStore';
import { State } from '../../../../../utils/CellularAutomata/Types';
import Row from './Row';

interface Props {
  historyStore: HistoryStore;
  colorPicker: (state: State) => string;
}

const History: React.FC<Props> = ({ historyStore, colorPicker }) => {
  const rows = [...historyStore.history, historyStore.current];
  return (
    <table className={`w-full`}>
      <tbody className={`transition ease-in-out delay-150 duration-300`}>
        {rows.map((g, i) => (
          <Row key={i} row={g} colorPicker={colorPicker} />
        ))}
      </tbody>
    </table>
  );
};

export default observer(History);
