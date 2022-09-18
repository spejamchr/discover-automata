import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import {
  maxNeighborIndex,
  minConsiderableStates,
  minNeighborIndex,
} from '../../../../utils/CellularAutomata/Decoders';
import { Index } from '../../../../utils/CellularAutomata/Types';
import { makeColorPicker } from '../../../../utils/ColorPicker';
import T from '../../../../utils/Locales/T';
import { shuffle } from '../../../../utils/Shuffle';
import Button from '../../../Button';
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

const Configuring: React.FC<Props> = ({ store }) => {
  const colorPicker = makeColorPicker(store);
  return (
    <div className={`shrink-0`}>
      <div>
        <Button onClick={store.toggleShowStateLabels}>
          <T kind={store.showStateLabels ? 'Showing state labels' : 'Hiding state labels'} />
        </Button>
      </div>
      <div>
        <Button onClick={store.toggleDisplayInColor}>
          <T kind={store.displayInColor ? 'Displaying in color' : 'Displaying in grayscale'} />
        </Button>
      </div>
      <label className={`block`}>
        <span className={`block text-sm font-medium`}>
          <T kind="States" /> ({store.minStates} - {store.maxStates})
        </span>
        <input
          type="number"
          min={minConsiderableStates}
          max={store.maxStates}
          step="1"
          value={store.states.map(String).getOrElseValue(store.userStates)}
          onChange={(e) => store.setStates(e.target.value)}
        />
        <Button
          onClick={() =>
            ok(store.maxStates)
              .map((max) => max - store.minStates)
              .map((size) => Math.random() * size + store.minStates)
              .map(Math.round)
              .map(String)
              .do(store.setStates)
          }
        >
          <T kind="Randomize" />
        </Button>
        {store.states.cata({
          Ok: () => <></>,
          Err: (e) => <span>{JSON.stringify(e)}</span>,
        })}
      </label>

      <div>
        <span className={`block text-sm font-medium`}>
          <T kind="Neighbors" /> ({store.minNeighbors} - {store.maxNeighbors})
        </span>
        {[...Array(maxNeighborIndex - minNeighborIndex + 1)]
          .map((_, i) => i + minNeighborIndex)
          .map((i) => (
            <Button
              style={{
                borderColor: isNeighborSelected(store, i)
                  ? colorPicker(store.automata.states - 1)[0]
                  : undefined,
              }}
              className={`${isNeighborSelected(store, i) ? 'border-2' : null} h-8 w-8 p-0`}
              key={i}
              onClick={toggleNeighbor(store, i)}
            >
              {i}
            </Button>
          ))}
        <Button
          onClick={() =>
            ok(store.maxNeighbors)
              .map((max) => max - store.minNeighbors)
              .map((size) => Math.random() * size + store.minNeighbors)
              .map(Math.round)
              .map((n) => shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, n))
              .do(store.setNeighbors)
          }
        >
          <T kind="Randomize" />
        </Button>
        {store.neighbors.cata({
          Ok: () => <></>,
          Err: (e) => <span>{JSON.stringify(e)}</span>,
        })}
      </div>
    </div>
  );
};

export default observer(Configuring);
