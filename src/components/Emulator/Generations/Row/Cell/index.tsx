import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { State } from '../../../../../utils/CellularAutomata/Types';
import { ColorPicker } from '../../../../../utils/ColorPicker';

interface Props {
  state: State;
  colorPicker: ColorPicker;
  className?: string;
}

const indices = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const Cell: React.FC<Props> = ({ state, colorPicker, className }) => {
  const [backgroundColor, color] = colorPicker(state);
  return (
    <span
      className={clsx(
        className,
        'flex h-[1rem] w-[1rem] min-w-[1ch] items-center justify-center font-mono text-xs dark:contrast-125 dark:hue-rotate-[120deg] dark:invert',
      )}
      style={{ backgroundColor, color }}
    >
      {indices[state] || state}
    </span>
  );
};

export default observer(Cell);
