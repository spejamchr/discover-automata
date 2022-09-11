import { observer } from 'mobx-react';
import * as React from 'react';
import { State } from '../../../../../utils/CellularAutomata/Types';
import { ColorPicker } from '../../../../../utils/ColorPicker';

interface Props {
  state: State;
  colorPicker: ColorPicker;
}

const indices = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const Cell: React.FC<Props> = ({ state, colorPicker }) => {
  const [backgroundColor, color] = colorPicker(state);
  return (
    <span
      className={`flex h-[1rem] w-[1rem] min-w-[1ch] items-center justify-center font-mono text-xs transition duration-500 ease-in-out`}
      style={{ backgroundColor, color }}
    >
      {indices[state] || state}
    </span>
  );
};

export default observer(Cell);
