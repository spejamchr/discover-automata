import { always } from '@kofno/piper';
import Store from '../../components/Emulator/Store';
import { State } from '../CellularAutomata/Types';
import { range } from '../Range';

export type ColorPicker = (state: State) => [string, string];

interface HSV {
  h: number; // 0 - 359
  s: number; // 0 - 1
  v: number; // 0 - 1
}

interface HSL {
  h: number; // 0 - 359
  s: number; // 0 - 1
  l: number; // 0 - 1
}

export const hsvToHsl = (hsv: HSV): HSL => {
  const h = hsv.h;
  const l = hsv.v * (1 - hsv.s / 2);
  const s = l == 0 || l == 1 ? 0 : (hsv.v - l) / Math.min(l, 1 - l);
  return { h, s, l };
};

// This is specific for a system with 10 max states.
export const defaultStartingHue = 310;
export const hLine =
  (startingHue: number) =>
  (state: number): number =>
    (startingHue - state * 40 + 360) % 360;
export const sLine = (state: number): number => 0.08 + state * 0.05;

const calcHs = (store: Store): ((state: number) => number) => {
  return store.displayInColor ? hLine(store.startingHue) : always(219);
};

const calcSs = (store: Store): ((state: number) => number) => {
  return store.displayInColor ? sLine : always(0.09);
};

const calcVs = (store: Store): ((state: number) => number) => {
  const { states } = store.automata;
  const start = 0.92;
  const end = 0.4;
  if (states === 1) return always(start);

  const step = (start - end) / (states - 1);
  return (state: number) => start - state * step;
};

export const makeColorPicker = (store: Store): ColorPicker => {
  const cH = calcHs(store),
    cS = calcSs(store),
    cV = calcVs(store);
  const { states } = store.automata;
  const hsvs = range(states).map((i) => ({ h: cH(i), s: cS(i), v: cV(i) }));
  const hsls = hsvs.map(hsvToHsl);
  const colors = hsls.map(
    ({ h, s, l }) => `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
  );

  if (store.showStateLabels) {
    const textColors = hsls.map(({ l }) => (l >= 0.42 ? 'black' : 'white'));
    return (state: State) => [colors[state % states], textColors[state % states]];
  } else {
    return (state: State) => [colors[state % states], 'rgba(0, 0, 0, 0)'];
  }
};
