import { parseIntM } from '@execonline-inc/numbers';
import { just } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import useMeasure from 'react-use/lib/useMeasure';
import { serialize } from '../../../../utils/CellularAutomata';
import { whenGTM } from '../../../../utils/Extensions';
import Cell from '../../Generations/Row/Cell';
import Store from '../../Store';
import History from '../Configuring/History';

interface Props {
  store: Store;
  height: number;
  className?: string;
}

const HistoryWithWidth: React.FC<Props> = ({ store, height, className }) => {
  const [ref, { width: fullWidth }] = useMeasure<HTMLDivElement>();
  const [cellRef, { width: cellWidth }] = useMeasure<HTMLDivElement>();

  const visibleEmulationWidth = just({})
    .assign('fullWidth', parseIntM(fullWidth.toString()).andThen(whenGTM(0)))
    .assign('cellWidth', parseIntM(cellWidth.toString()).andThen(whenGTM(0)))
    .map(({ fullWidth, cellWidth }) => Math.floor(fullWidth / cellWidth));

  return (
    <div className={className}>
      <div ref={ref} className={`flex transition-all delay-150 duration-300 ease-in-out`}>
        {visibleEmulationWidth
          .map((width) => (
            <History
              key={`${serialize(store.automata)}|${JSON.stringify(store.settings.firstGeneration)}`}
              emulatorStore={store}
              visibleEmulationWidth={width}
              height={height}
            />
          ))
          .getOrElse(() => (
            <></>
          ))}
      </div>
      <div ref={cellRef} className="max-h-0 w-fit">
        <Cell state={0} colorPicker={() => ['transparent', 'transparent']} />
      </div>
    </div>
  );
};

export default observer(HistoryWithWidth);
