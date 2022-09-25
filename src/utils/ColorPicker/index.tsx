import { always } from '@kofno/piper';
import Store from '../../components/Emulator/Store';
import { State } from '../CellularAutomata/Types';
import { range } from '../Range';

export type ColorPicker = (state: State) => [string, string];

const calcHues = (store: Store) => {
  const { states } = store.automata;
  const hueOffset = 140;

  if (!store.displayInColor) {
    return range(states).map(always(hueOffset));
  }

  const hueStepSize = 60;
  return range(states).map((i) => (i * hueStepSize + hueOffset) % 360);
};

export const makeColorPicker = (store: Store): ColorPicker => {
  const hues = calcHues(store);

  const { states } = store.automata;
  const minL = 25;
  const maxL = 92;
  const lStepSize = (maxL - minL) / (states - 1);
  const ls =
    states === 1
      ? [maxL]
      : range(states)
          .map((i) => i * lStepSize + minL)
          .reverse();

  const colors = hues.map((h, i) => `hsl(${h}, ${store.displayInColor ? '80%' : '8%'}, ${ls[i]}%)`);

  if (store.showStateLabels) {
    const textColors = ls.map((l) => (l >= 50 ? 'black' : 'white'));
    return (state: State) => [colors[state % states], textColors[state % states]];
  } else {
    return (state: State) => [colors[state % states], 'rgba(0, 0, 0, 0)'];
  }
};
