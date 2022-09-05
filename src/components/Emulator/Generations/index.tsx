import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../utils/CellularAutomata/HistoryStore';
import { State } from '../../../utils/CellularAutomata/Types';
import Row from './Row';

interface Props {
  historyStore: HistoryStore;
  colorPicker: (state: State) => string;
}

const Generations: React.FC<Props> = ({ historyStore, colorPicker }) =>
  historyStore.generations
    .map((generations) => (
      <table className={`w-full`}>
        <tbody className={`transition ease-in-out delay-150 duration-300`}>
          {generations.map((g, i) => (
            <Row key={i} row={g} colorPicker={colorPicker} />
          ))}
        </tbody>
      </table>
    ))
    .getOrElse(() => <></>);

export default observer(Generations);
