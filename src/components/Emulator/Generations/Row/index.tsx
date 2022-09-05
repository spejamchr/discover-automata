import { observer } from 'mobx-react';
import * as React from 'react';
import { Generation, State } from '../../../../utils/CellularAutomata/Types';

interface Props {
  row: Generation;
  colorPicker: (state: State) => string;
}

const Row: React.FC<Props> = ({ row, colorPicker }) => {
  return (
    <tr>
      {row.toArray().map((s, i) => (
        <td
          className={`transition ease-in-out delay-150 duration-300 w-[1%]`}
          style={{ backgroundColor: colorPicker(s), color: colorPicker(s) }}
          key={i}
        >
          {s}
        </td>
      ))}
    </tr>
  );
};

export default observer(Row);
