import { always } from '@kofno/piper';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { minConsiderableStates } from '../../../../../utils/CellularAutomata/Decoders';
import T from '../../../../../utils/Locales/T';
import Button from '../../../../Button';
import ValidationError from '../../../../ValidationError';
import Store from '../../../Store';

interface Props {
  store: Store;
  className?: string;
}

const States: React.FC<Props> = ({ store, className }) => {
  return (
    <span className={clsx(className)}>
      <label htmlFor="statesInput" className={`block text-sm font-medium`}>
        <T kind="States" /> ({store.minStates} - {store.maxStates})
      </label>
      <input
        id="statesInput"
        className={clsx('w-[10ch] rounded font-mono', {
          'border-rose-600 focus:border-rose-500 focus:ring focus:ring-rose-200': store.validStates
            .map(always(false))
            .getOrElseValue(true),
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
  );
};

export default observer(States);