import { observer } from 'mobx-react';
import * as React from 'react';
import { Generation } from '../../../../utils/CellularAutomata/Types';
import { ColorPicker } from '../../../../utils/ColorPicker';
import Cell from './Cell';

interface Props {
  row: Generation;
  colorPicker: ColorPicker;
}

const Row: React.FC<Props> = ({ row, colorPicker }) => {
  return (
    <tr>
      {row.toArray().map((s, i) => (
        <Cell key={i} state={s} colorPicker={colorPicker} />
      ))}
    </tr>
  );
};

export default observer(Row);
