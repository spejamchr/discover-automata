import { always, pipe } from '@kofno/piper';
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

const stepSizeForBound = (start: number, end: number, states: number): number =>
  states === 1 ? 0 : (end - start) / (states - 1);

const lineOnBound =
  (start: number, end: number, { automata: { states } }: Store) =>
  (state: number): number =>
    start + state * stepSizeForBound(start, end, states);

export const defaultStartingHue = 219;

const hLine = (store: Store) =>
  pipe(lineOnBound(store.startingHue, store.startingHue - 360, store), (hue) => (hue + 360) % 360);

const calcHs = (store: Store): ((state: number) => number) => {
  return store.settings.displayInColor ? hLine(store) : always(defaultStartingHue);
};

const calcSs = (store: Store): ((state: number) => number) =>
  store.settings.displayInColor ? lineOnBound(0.08, 0.6, store) : always(0.09);

const calcVs = (store: Store): ((state: number) => number) => lineOnBound(0.92, 0.4, store);

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

  if (store.settings.showStateLabels) {
    const textColors = hsls.map(({ l }) => (l >= 0.5 ? 'black' : 'white'));
    return (state: State) => [colors[state % states], textColors[state % states]];
  } else {
    return (state: State) => [colors[state % states], 'rgba(0, 0, 0, 0)'];
  }
};
