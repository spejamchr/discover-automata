import { observer } from 'mobx-react';
import * as React from 'react';
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
  const bigPrime = 100000007;
  const otherPrime = 61528937;
  const hueStepSize = 360 / automata.states;
  const lStepSize = 100 / automata.states;
  const offset = Math.floor((((automata.ruleId * otherPrime) ** 3 % bigPrime) / bigPrime) * 360);
  const colors = [...Array(automata.states)]
    .map((_, i) => [hueStepSize * i + offset, lStepSize * i + lStepSize / 3])
    .map(([hue, v]) => `hsl(${hue}, ${v}%, ${v}%)`);
  return (state: CellState): string => colors[state];
};

const Ready: React.FC<Props> = ({ store, state }) => {
  const colorPicker = makeColorPicker(state.history.automata);
  return (
    <div>
      <Reactions store={state.history} fireImmediately />
      <button onClick={store.configuring}>Back</button>
      <p>States: {state.history.automata.states}</p>
      <p>Neighbors: {state.history.automata.neighbors.join(', ')}</p>
      <p>Rule ID: {state.history.automata.ruleId}</p>
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
