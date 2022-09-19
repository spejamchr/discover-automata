import { observer } from 'mobx-react';
import * as React from 'react';
import { bigPow } from '../../../../../utils/BigIntExt';
import { Neighbors, State } from '../../../../../utils/CellularAutomata/Types';
import { fromBase } from '../../../../../utils/IntBase';
import { range } from '../../../../../utils/Range';
import Button from '../../../../Button';
import Cell from '../../../Generations/Row/Cell';
import EmptyCell from '../../../Generations/Row/EmptyCell';
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
      .do(store.setRuleId)
      .do(store.setAutomataIfNeeded);
  };

const neighborRange = (neighbors: Neighbors): Array<number> =>
  range(Math.min(0, Math.min(...neighbors)), Math.max(0, Math.max(...neighbors)));

const Rule: React.FC<Props> = ({ neighborStates, state, store }) => (
  <Button
    className={`m-1 flex flex-col items-center`}
    onClick={incrementResultState(neighborStates, state, store)}
  >
    <span className={`flex`}>
      {neighborRange(store.automata.neighbors).map((i) => {
        const ni = store.automata.neighbors.indexOf(i);
        if (ni === -1) {
          return <EmptyCell className="rounded-md border border-white" key={i} />;
        } else {
          return <Cell key={i} state={neighborStates[ni]} colorPicker={store.colorPicker} />;
        }
      })}
    </span>
    <span className={`flex`}>
      {neighborRange(store.automata.neighbors).map((i) => {
        if (i === 0) {
          return <Cell state={state} colorPicker={store.colorPicker} />;
        } else {
          return <EmptyCell key={i} />;
        }
      })}
    </span>
  </Button>
);

export default observer(Rule);
