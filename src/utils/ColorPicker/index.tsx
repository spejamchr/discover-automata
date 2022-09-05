import { serialize } from '../CellularAutomata';
import { Automata, State } from '../CellularAutomata/Types';
import { hasher } from '../StrHash';

export type ColorPicker = (state: State) => string;

export const makeColorPicker = (automata: Automata): ColorPicker => {
  const hueStepSize = 360 / automata.states;
  const lStepSize = 100 / automata.states;
  const hueOffset = hasher(serialize(automata)) % 360;
  const colors = [...Array(automata.states)]
    .map((_, i) => [hueStepSize * i + hueOffset, lStepSize * i + lStepSize / 2])
    .map(([hue, v]) => `hsl(${hue}, 50%, ${v}%)`);
  return (state: State): string => colors[state % automata.states];
};
