import { observer } from 'mobx-react';
import * as React from 'react';
import { calcId } from '../../../../utils/CellularAutomata';
import Reactions from '../../../../utils/CellularAutomata/HistoryStore/Reactions';
import { Automata, State as CellState } from '../../../../utils/CellularAutomata/Types';
import Store from '../../Store';
import { Ready as State } from '../../Types';
import History from './History';

interface Props {
  store: Store;
  state: State;
}

const makeColorPicker = (automata: Automata) => {
  const hueStepSize = 360 / automata.states;
  const lStepSize = 100 / automata.states;
  const offset = Math.floor(Math.random() * 360);
  const colors = [...Array(automata.states)]
    .map((_, i) => [hueStepSize * i + offset, lStepSize * i + lStepSize / 3])
    .map(([hue, v]) => `hsl(${hue}, ${v}%, ${v}%)`);
  return (state: CellState): string => colors[state];
};

const Ready: React.FC<Props> = ({ store, state }) => {
  const colorPicker = makeColorPicker(state.history.automata);
  return (
    <div>
      <Reactions store={state.history} />
      <button onClick={store.configuring}>Back</button>
      <p>States: {state.history.automata.states}</p>
      <p>Neighbors: {state.history.automata.neighbors.join(', ')}</p>
      <p>Rule ID: {calcId(state.history.automata.rules, state.history.automata.states)}</p>
      <button
        onClick={() => {
          for (let i = 0; i < 100; i++) {
            state.history.progress();
          }
        }}
      >
        Next
      </button>
      <History historyStore={state.history} colorPicker={colorPicker} />
    </div>
  );
};

export default observer(Ready);
