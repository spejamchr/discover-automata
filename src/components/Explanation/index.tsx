import { observer } from 'mobx-react';
import Link from 'next/link';
import React from 'react';
import { automataCtor } from '../../utils/CellularAutomata';
import T from '../../utils/Locales/T';
import { range } from '../../utils/Range';
import Cell from '../Emulator/Generations/Row/Cell';
import EmulatorReactions from '../Emulator/RenderState/Configuring/History/EmulatorReactions';
import Neighbors from '../Emulator/RenderState/Configuring/Neighbors';
import Rule from '../Emulator/RenderState/Rules/Rule';
import Store from '../Emulator/Store';
import Togglers from '../Emulator/Togglers';
import LinkedSection from '../LinkedSection';

interface Props {}

const simpleAutomaton = automataCtor({
  states: 2,
  neighbors: [-1, 0, 1],
  ruleId: BigInt(3),
});

class Explanation extends React.Component<Props> {
  store = new Store(true, false, simpleAutomaton);

  render() {
    return (
      <div className="prose mx-12 mb-72">
        <EmulatorReactions store={this.store} />

        <LinkedSection h="h1" kind="What's this all about?" />

        <p>
          <T kind="I wanted to make some fun designs, and had just read about [...]" />
        </p>

        <p>
          Read on, or skip straight to{' '}
          <Link href={'emulate'}>
            <a>the Emulator</a>
          </Link>
          .
        </p>

        <LinkedSection h="h2" kind="One-dimensional Cellular Automata" />

        <p>
          Cellular automata are a kind of zero-player game played on a "universe" of tiled "cells."
          Each automaton has its own configuration, and can evolve a universe through many
          generations. The most well-known cellular automaton is probably{' '}
          <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Conway's Game of Life</a>.
        </p>

        <p>
          <T kind="One-dimensional cellular automata (1DCA) are a kind of [...]" />
        </p>

        <table className="not-prose">
          <tbody>
            {range(3).map((r) => (
              <tr key={r}>
                {range(5).map((i) => (
                  <td key={i} className="h-8 w-8 border border-black text-center" />
                ))}
                <td className="pl-2">
                  (<T kind={r === 0 ? 'First generation' : 'Next generation'} />)
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <LinkedSection h="h2" kind="Configuration" />

        <p>
          <T kind="To define a 1DCA we need to know three things: the number [...]" />
        </p>

        <LinkedSection h="h3" kind="States" />

        <p>
          <T kind="Each cell in a cellular automata can be in one of several [...]" />
        </p>

        <span className="flex">
          {range(40).map((i) => (
            <Cell
              key={i}
              state={[1, 6, 7, 8, 13, 15, 18, 19, 22, 29, 30, 32, 36].indexOf(i) === -1 ? 0 : 1}
              colorPicker={this.store.colorPicker}
            />
          ))}
        </span>

        <p>
          <T kind="In this simulation, you can set the number of states the [...]" />
        </p>

        <Togglers store={this.store} />

        <LinkedSection h="h3" kind="Neighbors" />

        <p>
          <T kind="A simple example of a neighborhood is the current cell and [...]" />
        </p>

        <span className="flex">
          <Cell key={-1} state={0} colorPicker={this.store.colorPicker} />
          <Cell key={0} state={0} colorPicker={this.store.colorPicker} />
          <Cell key={1} state={0} colorPicker={this.store.colorPicker} />
        </span>

        <p>
          In general, there are{' '}
          <a href="https://cell-auto.com/neighbourhood/">many, many types of neighborhoods</a> that
          can be used to create cellular automata (including neighboorhoods that can change with
          time). However, neighborhoods used on this site are limited to a selection of the current
          cell and several of its closest neighbors on each side.
        </p>

        <Neighbors store={this.store} />

        <LinkedSection h="h3" kind="Transition Rules" />

        <p>
          Once the number of states and the neighborhood have been selected, the transition rules
          must be determined. For every possible combination of states in the given neighborhood,
          the resulting states must be chosen. As an example, here is the transition rule saying
          that if all of a cell's neighbors are <code>0</code> then the cell should become{' '}
          <code>{this.store.automata.rules[0]}</code>:
        </p>

        <Rule ruleIndex={0} state={this.store.automata.rules[0]} store={this.store} />

        <legend>
          (<T kind="Clicking the rule changes the resulting state." />)
        </legend>

        <p>
          <T kind="These transition rules can be encoded as a single number, [...]" />
        </p>

        <p>
          (The encoding for the transition rules as a "rule number" uses the{' '}
          <a href="https://en.wikipedia.org/wiki/Wolfram_code">Wolfram Code</a>.)
        </p>

        <LinkedSection h="h2" kind="Emulation" />

        <p>
          <T kind='I called this an "emulator" instead of a "simulator," [...]' />
        </p>

        <ul>
          <li>
            <T kind="A weather simulation can be used for predictions, but [...]" />
          </li>
          <li>
            <T kind="When using a (good) video game emulator, the video game [...]" />
          </li>
        </ul>
      </div>
    );
  }
}
export default observer(Explanation);
