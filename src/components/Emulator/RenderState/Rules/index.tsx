import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../Store';
import { toBase } from '../../../../utils/IntBase';
import Rule from './Rule';

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
    <div className={`flex flex-wrap overflow-y-auto items-start`}>
      {store.automata.rules
        .map((r, i) => (
          <Rule key={i} neighborStates={indexToNeighborStates(i)} state={r} store={store} />
        ))
        .reverse()}
    </div>
  );
};

export default observer(Rules);
