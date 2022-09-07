import Store from '../../components/Emulator/Store';
import { State } from '../CellularAutomata/Types';

export type ColorPicker = (state: State) => [string, string];

export const makeColorPicker = (store: Store): ColorPicker => {
  const { states } = store.automata;
  const minHueStepSize = 30;
  const hueStepSize = Math.max(minHueStepSize, 90 / states);
  const hueOffset = 0;
  const hues = [...Array(states)].map((_, i) => (i * hueStepSize + hueOffset) % 360);

  const buffer = 10;
  const lStepSize = (100 - 2 * buffer) / (states - 1);
  const ls =
    states === 1 ? [50] : [...Array(states)].map((_, i) => i * lStepSize + buffer).reverse();

  const colors = hues.map(
    (h, i) => `hsl(${h}, ${store.state.displayInColor ? '90%' : '0%'}, ${ls[i]}%)`,
  );

  if (store.state.showStateLabels) {
    const textColors = ls.map((l) => (l >= 50 ? 'black' : 'white'));
    return (state: State) => [colors[state % states], textColors[state % states]];
  } else {
    return (state: State) => [colors[state % states], 'rgba(0, 0, 0, 0)'];
  }
};
