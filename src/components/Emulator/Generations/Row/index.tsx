import clsx from 'clsx';
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
    <div className={`flex`}>
      {row.toArray().map((s, i) => (
        <Cell
          key={i}
          className={clsx('2xl:flex', {
            hidden: i > 25,
            'md:flex': i < 45,
            'lg:flex': i < 60,
            'xl:flex': i < 80,
          })}
          state={s}
          colorPicker={colorPicker}
        />
      ))}
    </div>
  );
};

export default observer(Row);
