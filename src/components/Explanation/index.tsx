import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React from 'react';
import { makeColorPicker } from '../../utils/ColorPicker';
import T from '../../utils/Locales/T';
import { range } from '../../utils/Range';
import Cell from '../Emulator/Generations/Row/Cell';
import Store from '../Emulator/Store';

interface Props {}

const store = new Store();
store.toggleShowStateLabels();
store.toggleDisplayInColor();
const colorPicker = makeColorPicker(store);

const Explanation: React.FC<Props> = () => (
  <div className="prose">
    <h1>Explanation</h1>
    <h2>
      <T kind={'One-dimensional Cellular Automata'} />
    </h2>
    <p>
      Cellular automata are a kind of "zero-player" game played on a tiling of "cells." Each
      automaton has its own rules, and can evolve an initial grid through many generations.
    </p>
    <p>
      One-dimensional cellular automata (1DCA) are a kind of cellular automata where the tiling is
      1D: it's a line of squares. This makes the many generations of a 1DCA easy to draw: we can
      draw all the generation lines one after another to form a rectangle.
    </p>
    <h2>The "rules"</h2>
    <p>
      To define a 1DCA we need to know three things: the number of <strong>states</strong> to use,
      which <strong>neighbors</strong> to consider when calculating the next generation, and the{' '}
      <strong>transition rules</strong> for deciding which state a cell will evolve into (based on
      the states of its neighbors).
    </p>
    <h3>States</h3>
    <p>
      Each cell in a cellular automata can be in one of several states, most often represented as a
      number (like 0 or 1) or a color (like black or white).
    </p>
    <span className="flex">
      {range(0, 39).map((i) => (
        <React.Fragment key={i}>
          <Cell
            state={
              (i - 1) % 7 === 0 || (i - 7) % 11 === 0 || (i - 11) % 13 === 0 || (i - 13) % 17 === 0
                ? 1
                : 0
            }
            colorPicker={colorPicker}
          />
        </React.Fragment>
      ))}
    </span>
    <p>
      In this simulation, you can toggle the simulation to use colors or a grayscale, and you can
      also toggle the number labels on or off.
    </p>
    <Link href={'emulate'}>
      <a>Emulator</a>
    </Link>
  </div>
);

export default observer(Explanation);
