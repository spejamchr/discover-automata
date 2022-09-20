import { always } from '@kofno/piper';
import Store from '../../components/Emulator/Store';
import { State } from '../CellularAutomata/Types';
import { range } from '../Range';

export type ColorPicker = (state: State) => [string, string];

const calcHues = (store: Store) => {
  const { states } = store.automata;

  if (!store.displayInColor) {
    return range(states).map(always(0));
  }

  const hueStepSize = 60;
  // Cycle every hour
  const hueOffset = ((Date.now() * 360) / (1000 * 60 * 60) + hueStepSize * states) % 360;
  return range(states).map((i) => (i * hueStepSize + hueOffset) % 360);
};

export const makeColorPicker = (store: Store): ColorPicker => {
  const hues = calcHues(store);

  const { states } = store.automata;
  const buffer = 15;
  const lStepSize = (100 - 2 * buffer) / (states - 1);
  const ls =
    states === 1
      ? [50]
      : range(states)
          .map((i) => i * lStepSize + buffer)
          .reverse();

  const colors = hues.map((h, i) => `hsl(${h}, ${store.displayInColor ? '90%' : '0%'}, ${ls[i]}%)`);

  if (store.showStateLabels) {
    const textColors = ls.map((l) => (l >= 50 ? 'black' : 'white'));
    return (state: State) => [colors[state % states], textColors[state % states]];
  } else {
    return (state: State) => [colors[state % states], 'rgba(0, 0, 0, 0)'];
  }
};
