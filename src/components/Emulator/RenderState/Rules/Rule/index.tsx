import { observer } from 'mobx-react';
import * as React from 'react';
import { bigPow } from '../../../../../utils/BigIntExt';
import { Neighbors, State } from '../../../../../utils/CellularAutomata/Types';
import { whenNEM } from '../../../../../utils/Extensions';
import { toBase } from '../../../../../utils/IntBase';
import { range } from '../../../../../utils/Range';
import Button from '../../../../Button';
import Cell from '../../../Generations/Row/Cell';
import EmptyCell from '../../../Generations/Row/EmptyCell';
import Store from '../../../Store';

interface Props {
  ruleIndex: number;
  state: State;
  store: Store;
}

const incrementResultState = (ruleIndex: number, state: State, store: Store) => (): void => {
  const base = store.automata.states;

  bigPow(BigInt(base), ruleIndex)
    .map((pow) => BigInt(((state + 1) % base) - state) * pow)
    .map((ruleDiff) => store.automata.ruleId + ruleDiff)
    .map(String)
    .do(store.setRuleId)
    .do(store.setAutomataIfNeeded);
};

const neighborRange = (neighbors: Neighbors): Array<number> =>
  range(Math.min(0, Math.min(...neighbors)), Math.max(0, Math.max(...neighbors)));

const indexToNeighborStates = (states: number, neighbors: number, i: number): Array<number> => {
  const { digits } = toBase(states)(i);
  const digitsM = digits.slice(0);
  while (digitsM.length < neighbors) digitsM.push(0);
  return digitsM.reverse();
};

const Rule: React.FC<Props> = ({ ruleIndex, state, store }) => {
  const neighborStates = indexToNeighborStates(
    store.automata.states,
    store.automata.neighbors.length,
    ruleIndex,
  );
  return (
    <Button
      className={`mt-1 mr-1 flex flex-col items-center`}
      onClick={incrementResultState(ruleIndex, state, store)}
    >
      <span className={`flex`}>
        {neighborRange(store.automata.neighbors).map((i) =>
          whenNEM(-1)(store.automata.neighbors.indexOf(i))
            .map((ni) => (
              <span key={i} className="m-0.5 border border-black">
                <Cell key={i} state={neighborStates[ni]} colorPicker={store.colorPicker} />
              </span>
            ))
            .getOrElse(() => (
              <span key={i} className="m-0.5 border border-transparent">
                <EmptyCell key={i} className="rounded-md border border-white" />
              </span>
            )),
        )}
      </span>
      <span className={`flex`}>
        {neighborRange(store.automata.neighbors).map((i) =>
          whenNEM(0)(i)
            .map(() => (
              <span key={i} className="m-0.5 border border-transparent">
                <EmptyCell key={i} />
              </span>
            ))
            .getOrElse(() => (
              <span key={i} className="m-0.5 border border-black">
                <Cell key={0} state={state} colorPicker={store.colorPicker} />
              </span>
            )),
        )}
      </span>
    </Button>
  );
};

export default observer(Rule);
