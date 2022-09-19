import { always } from '@kofno/piper';
import clsx from 'clsx';
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
import ValidationError from '../../../ValidationError';
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
    <div className={clsx(`flex shrink-0 flex-wrap items-center justify-between`)}>
      <span className={clsx(`flex`)}>
        <span>
          <label htmlFor="states" className={`block text-sm font-medium`}>
            <T kind="States" /> ({store.minStates} - {store.maxStates})
          </label>
          <input
            id="states"
            className={clsx('w-[10ch] rounded font-mono', {
              'border-rose-600 focus:border-rose-500 focus:ring focus:ring-rose-200':
                store.validStates.map(always(false)).getOrElseValue(true),
            })}
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
          <ValidationError errorable={store.validStates} />
        </span>

        <span className="ml-12">
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
                className={clsx(`h-8 w-8 p-0`, {
                  'border-2': isNeighborSelected(store, i),
                  'bg-rose-200': store.validNeighbors.map(always(false)).getOrElseValue(true),
                })}
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
          <ValidationError errorable={store.validNeighbors} />
        </span>
      </span>

      <span>
        <Button onClick={store.toggleShowStateLabels}>
          <T kind={store.showStateLabels ? 'Showing state labels' : 'Hiding state labels'} />
        </Button>
        <Button onClick={store.toggleDisplayInColor}>
          <T kind={store.displayInColor ? 'Displaying in color' : 'Displaying in grayscale'} />
        </Button>
      </span>
    </div>
  );
};

export default observer(Configuring);
