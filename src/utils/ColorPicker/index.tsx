import { serialize } from '../CellularAutomata';
import { Automata, State } from '../CellularAutomata/Types';
import { hasher } from '../StrHash';

export const makeColorPicker = (automata: Automata) => {
  const hueStepSize = 90 / automata.states;
  const lStepSize = 100 / automata.states;
  const hueOffset = hasher(serialize(automata)) % 360;
  const colors = [...Array(automata.states)]
    .map((_, i) => [hueStepSize * i + hueOffset, lStepSize * i + lStepSize / 2])
    .map(([hue, v]) => `hsl(${hue}, 50%, ${v}%)`);
  return (state: State): string => colors[state % automata.states];
};
