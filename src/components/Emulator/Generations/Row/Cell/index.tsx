import { observer } from 'mobx-react';
import * as React from 'react';
import { State } from '../../../../../utils/CellularAutomata/Types';
import { ColorPicker } from '../../../../../utils/ColorPicker';

interface Props {
  state: State;
  colorPicker: ColorPicker;
}

const indices = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const Cell: React.FC<Props> = ({ state, colorPicker }) => (
  <td
    className={`transition ease-in-out duration-500 w-4 text-center`}
    style={{ backgroundColor: colorPicker(state) }}
  >
    <code>{indices[state] || state}</code>
  </td>
);

export default observer(Cell);
