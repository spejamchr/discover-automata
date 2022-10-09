import { parseIntM } from '@execonline-inc/numbers';
import { observer } from 'mobx-react';
import * as React from 'react';
import useMeasure from 'react-use/lib/useMeasure';
import { serialize } from '../../../../utils/CellularAutomata';
import { whenGTM } from '../../../../utils/Extensions';
import { cellPixelSize } from '../../Generations';
import Store from '../../Store';
import History from './History';

interface Props {
  store: Store;
  height: number;
  className?: string;
}

const HistoryWithWidth: React.FC<Props> = ({ store, height, className }) => {
  const [ref, { width: fullWidth }] = useMeasure<HTMLDivElement>();

  const visibleEmulationWidth = parseIntM(fullWidth.toString())
    .andThen(whenGTM(0))
    .map((fullWidth) => Math.floor(fullWidth / cellPixelSize));

  return (
    <div className={className} style={{ minHeight: `${height * cellPixelSize}px` }}>
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
    </div>
  );
};

export default observer(HistoryWithWidth);
