import { Automata, State } from '../CellularAutomata/Types';

export const makeColorPicker = (automata: Automata) => {
  const bigPrime = 100000007;
  const otherPrime = 61528937;
  const hueStepSize = 360 / automata.states;
  const lStepSize = 100 / automata.states;
  const offset = Math.floor((((automata.ruleId * otherPrime) ** 3 % bigPrime) / bigPrime) * 360);
  const colors = [...Array(automata.states)]
    .map((_, i) => [hueStepSize * i + offset, lStepSize * i + lStepSize / 3])
    .map(([hue, v]) => `hsl(${hue}, ${v}%, ${v}%)`);
  return (state: State): string => colors[state];
};
