import { always } from '@kofno/piper';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { minConsiderableStates } from '../../../../../utils/CellularAutomata/Decoders';
import T from '../../../../../utils/Locales/T';
import Button from '../../../../Button';
import ErrorStyled from '../../../../ErrorStyled';
import Ranged from '../../../../Ranged';
import Store from '../../../Store';
import ExampleStates from './ExampleStates';

interface Props {
  store: Store;
  className?: string;
}

const States: React.FC<Props> = ({ store, className }) => {
  return (
    <span className={clsx(className)}>
      <label htmlFor="statesInput" className={`text-sm font-medium`}>
        <T kind="States" /> (
        <ErrorStyled result={store.validStates}>
          <Ranged low={store.minStates} high={store.maxStates} />
        </ErrorStyled>
        )
        <ExampleStates store={store} />
      </label>
      <span className="mb-1 flex max-w-full flex-wrap items-start">
        <input
          id="statesInput"
          className={clsx('mr-1 h-10 w-48 rounded font-mono dark:bg-slate-700', {
            'border-rose-600 focus:border-rose-500 focus:ring focus:ring-rose-200 dark:border-rose-300 dark:focus:border-rose-400 dark:focus:ring-rose-900':
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
          className="mr-1 flex h-10 items-center justify-center"
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
      </span>
    </span>
  );
};

export default observer(States);
