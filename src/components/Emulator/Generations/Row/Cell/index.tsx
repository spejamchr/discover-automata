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
      className={`text-xs transition ease-in-out duration-500 flex items-center justify-center w-[1rem] h-[1rem] min-w-[1ch] font-mono`}
      style={{ backgroundColor, color }}
    >
      {indices[state] || state}
    </span>
  );
};

export default observer(Cell);
