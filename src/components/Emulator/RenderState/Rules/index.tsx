import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../Store';
import { toBase } from '../../../../utils/IntBase';
import Rule from './Rule';
import T from '../../../../utils/Locales/T';

interface Props {
  store: Store;
}

const indexToNeighborStatesMaker =
  (states: number, neighbors: number) =>
  (i: number): Array<number> => {
    const { digits } = toBase(states)(i);
    const digitsM = digits.slice(0);
    while (digitsM.length < neighbors) digitsM.push(0);
    return digitsM.reverse();
  };

const Rules: React.FC<Props> = ({ store }) => {
  const indexToNeighborStates = indexToNeighborStatesMaker(
    store.automata.states,
    store.automata.neighbors.length,
  );
  return (
    <details>
      <summary
        className={
          'm-1 cursor-pointer rounded bg-slate-300 p-2 transition hover:bg-slate-400 hover:text-slate-800 active:bg-slate-500 active:text-slate-900'
        }
      >
        <T kind={'Transition Patterns'} />
      </summary>
      <div className={`box-content flex flex-wrap content-start items-start justify-center`}>
        {store.automata.rules
          .map((r, i) => (
            <Rule key={i} neighborStates={indexToNeighborStates(i)} state={r} store={store} />
          ))
          .reverse()}
      </div>
    </details>
  );
};

export default observer(Rules);
