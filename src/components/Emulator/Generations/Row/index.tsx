import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ColorPicker } from '../../../../utils/ColorPicker';
import Cell from './Cell';

interface Props {
  row: Array<number>;
  colorPicker: ColorPicker;
}

const Row: React.FC<Props> = ({ row, colorPicker }) => {
  return (
    <div className={`flex`}>
      {row.map((s, i) => (
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
