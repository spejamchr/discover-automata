import { always } from '@kofno/piper';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { Index } from '../../../../utils/CellularAutomata/Types';
import { whenLER } from '../../../../utils/Extensions';
import { shuffle } from '../../../../utils/Shuffle';
import Store from '../../Store';

interface Props {
  store: Store;
}

const isNeighborSelected = (store: Store, index: Index): boolean =>
  store.userNeighbors.includes(index);

const toggleNeighbor =
  (store: Store, index: Index): React.MouseEventHandler<HTMLButtonElement> =>
  (e) => {
    e.preventDefault();
    store.setNeighbors(
      isNeighborSelected(store, index)
        ? store.userNeighbors.filter((i) => i !== index)
        : [...store.userNeighbors, index],
    );
  };

const Configuring: React.FC<Props> = ({ store }) => (
  <div className={`shrink-0`}>
    <div>
      <button onClick={store.toggleShowStateLabels}>
        {store.showStateLabels ? 'Showing state labels' : 'Hiding state labels'}
      </button>
    </div>
    <div>
      <button onClick={store.toggleDisplayInColor}>
        {store.displayInColor ? 'Displaying in color' : 'Displaying in grayscale'}
      </button>
    </div>
    <label className={`block`}>
      <span className={`block text-sm font-medium`}>
        States ({store.minStates} - {store.maxStates})
      </span>
      <input
        type="number"
        min="1" // Intentionally ignore the minStates value here
        max={store.maxStates}
        step="1"
        value={store.states.map(String).getOrElseValue(store.userStates)}
        onChange={(e) => store.setStates(e.target.value)}
      />
      <button
        onClick={() =>
          ok(store.maxStates)
            .map((max) => max - store.minStates)
            .map((size) => Math.random() * size + store.minStates)
            .map(Math.round)
            .map(String)
            .do(store.setStates)
        }
      >
        Randomize
      </button>
      {store.states.cata({
        Ok: () => <></>,
        Err: (e) => <span>{JSON.stringify(e)}</span>,
      })}
    </label>

    <div>
      <span className={`block text-sm font-medium`}>
        Neighbors ({store.minNeighbors} - {store.maxNeighbors})
      </span>
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
        <button
          className={`${
            isNeighborSelected(store, i) ? 'border-green-300' : 'border-slate-300'
          } m-0.5 h-7 w-7 rounded border-2`}
          key={i}
          onClick={toggleNeighbor(store, i)}
        >
          {i}
        </button>
      ))}
      <button
        onClick={() =>
          ok(store.maxNeighbors)
            .map((max) => max - store.minNeighbors)
            .map((size) => Math.random() * size + store.minNeighbors)
            .map(Math.round)
            .map((n) => shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, n))
            .do(store.setNeighbors)
        }
      >
        Randomize
      </button>
      {store.neighbors.cata({
        Ok: () => <></>,
        Err: (e) => <span>{JSON.stringify(e)}</span>,
      })}
    </div>
  </div>
);

export default observer(Configuring);
