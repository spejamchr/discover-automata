import { observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../Store';
import { toBase } from '../../../../utils/IntBase';
import Rule from './Rule';
import { makeColorPicker } from '../../../../utils/ColorPicker';

interface Props {
  store: Store;
}

const indexToNeighborStatesMaker =
  (states: number, neighbors: number) =>
  (i: number): Array<number> => {
    const { digits } = toBase(states)(i);
    const digitsM = digits.slice(0);
    while (digitsM.length < neighbors) digitsM.push(0);
    return digitsM;
  };

const Rules: React.FC<Props> = ({ store }) => {
  const indexToNeighborStates = indexToNeighborStatesMaker(
    store.automata.states,
    store.automata.neighbors.length,
  );
  const colorPicker = makeColorPicker(store.automata);
  return (
    <div className={`flex flex-wrap`}>
      {store.automata.rules
        .map((r, i) => (
          <Rule
            key={i}
            neighborStates={indexToNeighborStates(i)}
            state={r}
            colorPicker={colorPicker}
          />
        ))
        .reverse()}
    </div>
  );
};

export default observer(Rules);
