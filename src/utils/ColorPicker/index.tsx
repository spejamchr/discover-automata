import Store from '../../components/Emulator/Store';
import { serialize } from '../CellularAutomata';
import { State } from '../CellularAutomata/Types';
import { hasher } from '../StrHash';

export type ColorPicker = (state: State) => [string, string];

export const makeColorPicker = (store: Store): ColorPicker => {
  const { automata } = store;
  const minHueStepSize = 30;
  const hueStepSize = Math.max(minHueStepSize, 90 / automata.states);
  const hueOffset = hasher(serialize(automata)) % 360;
  const hues = [...Array(automata.states)].map((_, i) => (i * hueStepSize + hueOffset) % 360);

  const buffer = 10;
  const lStepSize = (100 - 2 * buffer) / (automata.states - 1);
  const ls =
    automata.states === 1
      ? [50]
      : [...Array(automata.states)].map((_, i) => i * lStepSize + buffer).reverse();

  const colors = hues.map(
    (h, i) => `hsl(${h}, ${store.state.displayInColor ? '90%' : '0%'}, ${ls[i]}%)`,
  );

  if (store.state.showStateLabels) {
    const textColors = ls.map((l) => (l >= 50 ? 'black' : 'white'));
    return (state: State) => [colors[state % automata.states], textColors[state % automata.states]];
  } else {
    return (state: State) => [colors[state % automata.states], 'rgba(0, 0, 0, 0)'];
  }
};
