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
    <div className={`flex w-fit`}>
      {row.toArray().map((s, i) => (
        <Cell key={i} state={s} colorPicker={colorPicker} />
      ))}
    </div>
  );
};

export default observer(Row);
