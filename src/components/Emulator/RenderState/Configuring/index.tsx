import { always } from '@kofno/piper';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ok } from 'resulty';
import { Index } from '../../../../utils/CellularAutomata/Types';
import { whenGTR } from '../../../../utils/Extensions';
import Store from '../../Store';
import { Configuring as State } from '../../Types';

interface Props {
  store: Store;
  state: State;
}

const isNeighborSelected = (state: State, index: Index): boolean => state.neighbors.includes(index);

const toggleNeighbor =
  (store: Store, state: State, index: Index): React.MouseEventHandler<HTMLButtonElement> =>
  (e) => {
    e.preventDefault();
    store.setNeighbors(
      isNeighborSelected(state, index)
        ? state.neighbors.filter((i) => i !== index)
        : [...state.neighbors, index],
    );
  };

const Configuring: React.FC<Props> = ({ store, state }) => (
  <div className={`shrink-0`}>
    <div>
      <button onClick={store.toggleShowStateLabels}>
        {store.state.showStateLabels ? 'Showing state labels' : 'Hiding state labels'}
      </button>
    </div>
    <div>
      <button onClick={store.toggleDisplayInColor}>
        {store.state.displayInColor ? 'Displaying in color' : 'Displaying in grayscale'}
      </button>
    </div>
    <label className={`block`}>
      <span className={`block text-sm font-medium text-slate-700`}>
        States ({store.minStates} - {store.maxStates})
      </span>
      <input
        type="number"
        min="1" // Intentionally ignore the minStates value here
        max={store.maxStates}
        step="1"
        value={store.states.map(String).getOrElseValue(state.states)}
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
      <span className={`block text-sm font-medium text-slate-700`}>
        Neighbors ({store.minNeighbors} - {store.maxNeighbors})
      </span>
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
        <button
          className={`${
            isNeighborSelected(state, i) ? 'border-green-300' : 'border-slate-300'
          } border-2 w-7 h-7 m-0.5 rounded`}
          key={i}
          onClick={toggleNeighbor(store, state, i)}
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
            .map((n) => [-3, -2, -1, 0, 1, 2, 3].sort(() => Math.random() - 0.5).slice(0, n))
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

    <label className={`block`}>
      <span className={`block text-sm font-medium text-slate-700`}>
        Rule ID{' '}
        {store.maxRuleId
          .map((max) =>
            max > BigInt(Number.MAX_SAFE_INTEGER)
              ? `(maximum digits: ${String(max).length})`
              : `(${String(store.minRuleId)} - ${String(max)})`,
          )
          .getOrElseValue('')}
      </span>
      <input
        type={store.ruleId
          .andThen((e) => whenGTR(BigInt(Number.MAX_SAFE_INTEGER))(e).mapError(String))
          .map(always('text'))
          .getOrElseValue('number')}
        min={String(store.minRuleId)}
        max={store.maxRuleId.map(String).getOrElseValue('')}
        step="1"
        value={store.ruleId.map(String).getOrElseValue(state.ruleId)}
        onChange={(e) => store.setRuleId(e.target.value)}
      />
      <button onClick={store.randomizeRules}>Randomize</button>
      {store.ruleId.cata({
        Ok: () => <></>,
        Err: (e) => <span>{JSON.stringify(e)}</span>,
      })}
    </label>
  </div>
);

export default observer(Configuring);
