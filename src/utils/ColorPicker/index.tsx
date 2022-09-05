import { serialize } from '../CellularAutomata';
import { Automata, State } from '../CellularAutomata/Types';
import { hasher } from '../StrHash';

export type ColorPicker = (state: State) => [string, string];

export const makeColorPicker = (automata: Automata): ColorPicker => {
  const minHueStepSize = 30;
  const hueStepSize = Math.max(minHueStepSize, 90 / automata.states);
  const hueOffset = hasher(serialize(automata)) % 360;
  const hues = [...Array(automata.states)].map((_, i) => i * hueStepSize + hueOffset);

  const buffer = 10;
  const lStepSize = (100 - 2 * buffer) / (automata.states - 1);
  const ls =
    automata.states === 1
      ? [50]
      : [...Array(automata.states)].map((_, i) => i * lStepSize + buffer).reverse();

  const colors = hues.map((h, i) => `hsl(${h}, 90%, ${ls[i]}%)`);
  const textColors = ls.map((l) => (l >= 50 ? 'black' : 'white'));
  return (state: State) => [colors[state % automata.states], textColors[state % automata.states]];
};
