import { observer } from 'mobx-react';
import * as React from 'react';
import { State } from '../../../../../utils/CellularAutomata/Types';
import { ColorPicker } from '../../../../../utils/ColorPicker';
import Cell from '../../../Generations/Row/Cell';

interface Props {
  neighborStates: Array<State>;
  state: State;
  colorPicker: ColorPicker;
}

const Rule: React.FC<Props> = ({ neighborStates, state, colorPicker }) => (
  <span className={`flex flex-col m-1 items-center`}>
    <span>
      {neighborStates.map((s) => (
        <Cell state={s} colorPicker={colorPicker} />
      ))}
    </span>
    <Cell state={state} colorPicker={colorPicker} />
  </span>
);

export default observer(Rule);
