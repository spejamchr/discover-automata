import { observer } from 'mobx-react';
import * as React from 'react';
import { bigPow } from '../../../../../utils/BigIntExt';
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
      kind: 'int-base',
      base,
      digits: neighborStates.slice(0).reverse(),
    });

    bigPow(BigInt(base), ruleIndex)
      .map((pow) => BigInt(((state + 1) % base) - state) * pow)
      .map((ruleDiff) => store.automata.ruleId + ruleDiff)
      .map(String)
      .do(store.setRuleId);
  };

const Rule: React.FC<Props> = ({ neighborStates, state, store }) => (
  <button
    className={`m-1 flex flex-col items-center`}
    onClick={incrementResultState(neighborStates, state, store)}
  >
    <span className={`flex`}>
      {neighborStates.map((s, i) => (
        <Cell key={i} state={s} colorPicker={store.colorPicker} />
      ))}
    </span>
    <Cell state={state} colorPicker={store.colorPicker} />
  </button>
);

export default observer(Rule);
