import { observer } from 'mobx-react';
import * as React from 'react';
import { State } from '../../../../../utils/CellularAutomata/Types';
import { fromBase } from '../../../../../utils/IntBase';
import Cell from '../../../Generations/Row/Cell';
import Store from '../../../Store';

interface Props {
  neighborStates: ReadonlyArray<State>;
  state: State;
  store: Store;
}

const incrementResultState =
  (neighborStates: ReadonlyArray<State>, state: State, store: Store) => (): void => {
    const base = store.automata.states;
    const ruleIndex = fromBase({
      base,
      digits: neighborStates.slice(0).reverse(),
    });
    const ruleDiff = (((state + 1) % base) - state) * base ** ruleIndex;
    store.setRuleId(String(store.automata.ruleId + ruleDiff));
  };

const Rule: React.FC<Props> = ({ neighborStates, state, store }) => (
  <span className={`flex flex-col m-1 items-center`}>
    <button onClick={incrementResultState(neighborStates, state, store)}>
      <span className={`flex`}>
        {neighborStates.map((s, i) => (
          <Cell key={i} state={s} colorPicker={store.colorPicker} />
        ))}
      </span>
    </button>
    <button onClick={incrementResultState(neighborStates, state, store)}>
      <Cell state={state} colorPicker={store.colorPicker} />
    </button>
  </span>
);

export default observer(Rule);
