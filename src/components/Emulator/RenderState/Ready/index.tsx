import { observer } from 'mobx-react';
import * as React from 'react';
import { calcId } from '../../../../utils/CellularAutomata';
import Store from '../../Store';
import { Ready as State } from '../../Types';

interface Props {
  store: Store;
  state: State;
}

const Ready: React.FC<Props> = ({ store, state }) => (
  <div>
    <p>States: {state.history.automata.states}</p>
    <p>Neighbors: {state.history.automata.neighbors.join(', ')}</p>
    <p>Rule ID: {calcId(state.history.automata.rules, state.history.automata.states)}</p>
  </div>
);

export default observer(Ready);
