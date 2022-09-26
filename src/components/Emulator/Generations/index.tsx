import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import HistoryStore from '../../../utils/CellularAutomata/HistoryStore';
import { negBufferWidth } from '../../../utils/CellularAutomata/HistoryStore/Reactions';
import { ColorPicker } from '../../../utils/ColorPicker';
import Row from './Row';

interface Props {
  historyStore: HistoryStore;
  colorPicker: ColorPicker;
}

const Generations: React.FC<Props> = ({ historyStore, colorPicker }) => {
  const negBuffer = negBufferWidth(historyStore);
  const width = Math.min(historyStore.visibleEmulationWidth, historyStore.showableEmulationWidth);
  return (
    <div
      className={clsx(
        'min-h-screen overflow-x-hidden transition-opacity duration-300 ease-linear',
        {
          'opacity-0': historyStore.generations.length < 10,
          'opacity-50': historyStore.generations.length < 30,
        },
      )}
    >
      {historyStore.generations.map((g, i) => (
        <Row
          key={i}
          row={g.toArray().slice(negBuffer, negBuffer + width)}
          colorPicker={colorPicker}
        />
      ))}
    </div>
  );
};

export default observer(Generations);
