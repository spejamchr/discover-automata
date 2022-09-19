import { observer } from 'mobx-react-lite';
import React from 'react';
import T from '../../utils/Locales/T';
import { range } from '../../utils/Range';
import Cell from '../Emulator/Generations/Row/Cell';

interface Props {}

const Explanation: React.FC<Props> = () => (
  <div className="prose">
    <h1>Explanation</h1>
    <h2>
      <T kind={'One-dimensional Cellular Automata'} />
    </h2>
    <p>
      Cellular automata are a kind of "zero-player" game played on a grid of square "cells." Each
      automaton has its own rules, and can evolve an initial grid through many generations.
    </p>
    <p>
      One-dimensional cellular automata (1DCA) are kind of cellular automata where the grid is 1D:
      it's a line of squares. This makes the many generations of a 1DCA easy to draw, because the
      many generations can be drawn together to form a rectangle.
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
      {range(0, 39).map((i) => {
        const colorPicker = (state: number): [string, string] =>
          state === 0 ? ['black', 'white'] : ['white', 'black'];
        return (
          <React.Fragment key={i}>
            <Cell state={Math.round(Math.random())} colorPicker={colorPicker} />
          </React.Fragment>
        );
      })}
    </span>
  </div>
);

export default observer(Explanation);
