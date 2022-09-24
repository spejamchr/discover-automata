import { always } from '@kofno/piper';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { maxNeighborIndex, minNeighborIndex } from '../../../../../utils/CellularAutomata/Decoders';
import { Index } from '../../../../../utils/CellularAutomata/Types';
import T from '../../../../../utils/Locales/T';
import { range } from '../../../../../utils/Range';
import { shuffle } from '../../../../../utils/Shuffle';
import Button from '../../../../Button';
import ErrorStyled from '../../../../ErrorStyled';
import Ranged from '../../../../Ranged';
import Store from '../../../Store';

interface Props {
  store: Store;
  className?: string;
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

const Neighbors: React.FC<Props> = ({ store, className }) => {
  return (
    <span className={clsx(className, 'flex flex-wrap items-end')}>
      <span className="flex flex-col">
        <span className={`text-sm font-medium`}>
          <T kind="Neighbors" /> (
          <ErrorStyled result={store.validNeighbors}>
            <Ranged low={store.minNeighbors} high={store.maxNeighbors} />
          </ErrorStyled>
          )
        </span>
        <span>
          {[...Array(maxNeighborIndex - minNeighborIndex + 1)]
            .map((_, i) => i + minNeighborIndex)
            .map((i) => (
              <Button
                style={{
                  borderColor: isNeighborSelected(store, i)
                    ? store.colorPicker(store.automata.states - 1)[0]
                    : undefined,
                }}
                className={clsx(`mb-1 mr-1 h-10 w-10 p-0`, {
                  'border-2': isNeighborSelected(store, i),
                  'bg-rose-200': store.validNeighbors.map(always(false)).getOrElseValue(true),
                })}
                key={i}
                onClick={toggleNeighbor(store, i)}
              >
                {i}
              </Button>
            ))}
        </span>
      </span>
      <Button
        className="mb-1"
        onClick={() =>
          ok(store.maxNeighbors)
            .map((max) => max - store.minNeighbors)
            .map((size) => Math.random() * size + store.minNeighbors)
            .map(Math.round)
            .map((n) => shuffle(range(minNeighborIndex, maxNeighborIndex)).slice(0, n))
            .do(store.setNeighbors)
        }
      >
        <T kind="Randomize" />
      </Button>
    </span>
  );
};

export default observer(Neighbors);
