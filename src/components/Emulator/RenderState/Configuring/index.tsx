import { observer } from 'mobx-react';
import * as React from 'react';
import Reactions from '../../../../utils/CellularAutomata/HistoryStore/Reactions';
import { Automata, Index, State as CellState } from '../../../../utils/CellularAutomata/Types';
import Generations from '../../Generations';
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

const makeColorPicker = (automata: Automata) => {
  const bigPrime = 100000007;
  const otherPrime = 61528937;
  const hueStepSize = 360 / automata.states;
  const lStepSize = 100 / automata.states;
  const offset = Math.floor((((automata.ruleId * otherPrime) ** 3 % bigPrime) / bigPrime) * 360);
  const colors = [...Array(automata.states)]
    .map((_, i) => [hueStepSize * i + offset, lStepSize * i + lStepSize / 3])
    .map(([hue, v]) => `hsl(${hue}, ${v}%, ${v}%)`);
  return (state: CellState): string => colors[state];
};

const Configuring: React.FC<Props> = ({ store, state }) => (
  <div>
    <form>
      <label className={`block`}>
        <span className={`block text-sm font-medium text-slate-700`}>States</span>
        <input
          type="number"
          min={store.minStates}
          max={store.maxStates.map(String).getOrElseValue('')}
          step="1"
          value={store.states.map(String).getOrElseValue(state.states)}
          onChange={(e) => store.setStates(e.target.value)}
        />
        {store.states.cata({
          Ok: () => <></>,
          Err: (e) => <span>{JSON.stringify(e)}</span>,
        })}
      </label>
      <div>
        <span className={`block text-sm font-medium text-slate-700`}>Neighbors</span>
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
        {store.neighbors.cata({
          Ok: () => <></>,
          Err: (e) => <span>{JSON.stringify(e)}</span>,
        })}
      </div>

      <label className={`block`}>
        <span className={`block text-sm font-medium text-slate-700`}>Rule ID</span>
        <input
          type="number"
          min={store.minRuleId}
          max={store.maxRuleId.map(String).getOrElseValue('')}
          step="1"
          value={store.ruleId.map(String).getOrElseValue(state.ruleId)}
          onChange={(e) => store.setRuleId(e.target.value)}
        />
        {store.ruleId.cata({
          Ok: () => <></>,
          Err: (e) => <span>{JSON.stringify(e)}</span>,
        })}
      </label>
    </form>
    {store.historyStore
      .map((historyStore) => (
        <div key={store.serialized.getOrElseValue('')}>
          <Reactions store={historyStore} fireImmediately />
          <Generations
            historyStore={historyStore}
            colorPicker={makeColorPicker(historyStore.automata)}
          />
        </div>
      ))
      .getOrElse(() => (
        <></>
      ))}
  </div>
);

export default observer(Configuring);
