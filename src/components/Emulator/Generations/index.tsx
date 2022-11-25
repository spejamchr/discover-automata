import { observer } from 'mobx-react';
import * as React from 'react';
import { serialize } from '../../../utils/CellularAutomata';
import HistoryStore from '../../../utils/CellularAutomata/HistoryStore';
import { negBufferWidth } from '../../../utils/CellularAutomata/HistoryStore/Reactions';
import { ColorPicker } from '../../../utils/ColorPicker';
import WithTFns from '../../../utils/Locales/WithTFns';
import { canvasAndContext } from '../../CanvasAndContext';
import { indices } from './Cell';

interface Props {
  historyStore: HistoryStore;
  colorPicker: ColorPicker;
}

export const cellPixelSize = 16;

const Generations: React.FC<Props> = ({ historyStore, colorPicker }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const negBuffer = negBufferWidth(historyStore);
  const width = Math.min(historyStore.visibleEmulationWidth, historyStore.showableEmulationWidth);
  const pixelWidth = width * cellPixelSize;
  const pixelHeight = historyStore.generations.length * cellPixelSize;
  const fontSize = (cellPixelSize * 3) / 4;

  React.useEffect(() => {
    canvasAndContext(ref, pixelHeight, pixelWidth).do(({ context }) => {
      context.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
      historyStore.generations.forEach((g, i) => {
        g.toArray()
          .slice(negBuffer, negBuffer + width)
          .forEach((s, j) => {
            const x = j * cellPixelSize;
            const y = i * cellPixelSize;
            context.fillStyle = colorPicker(s)[0];
            context.fillRect(x, y, cellPixelSize * 1.5, cellPixelSize * 1.5);
            context.fillStyle = colorPicker(s)[1];
            context.fillText(indices[s], x + cellPixelSize / 4, y + fontSize);
          });
      });
    });
  });

  return (
    <WithTFns>
      {({ t }) => (
        <canvas
          className="dark:hue-rotate-[180deg] dark:invert"
          ref={ref}
          role="img"
          aria-label={`${t('One-dimensional Cellular Automata')}: ${serialize(
            historyStore.automata,
          )}`}
        />
      )}
    </WithTFns>
  );
};

export default observer(Generations);
