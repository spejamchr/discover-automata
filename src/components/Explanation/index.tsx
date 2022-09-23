import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { automataCtor } from '../../utils/CellularAutomata';
import T from '../../utils/Locales/T';
import WithTFns from '../../utils/Locales/WithTFns';
import { range } from '../../utils/Range';
import Cell from '../Emulator/Generations/Row/Cell';
import EmptyCell from '../Emulator/Generations/Row/EmptyCell';
import EmulatorReactions from '../Emulator/RenderState/Configuring/History/EmulatorReactions';
import Neighbors from '../Emulator/RenderState/Configuring/Neighbors';
import Rule from '../Emulator/RenderState/Rules/Rule';
import Store from '../Emulator/Store';
import Togglers from '../Emulator/Togglers';
import LanguagePicker from '../LanguagePicker';
import LinkedSection from '../LinkedSection';
import LocaleLink from '../LocaleLink';

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
      <div className="prose mx-2 mb-72 pt-10 sm:mx-12">
        <EmulatorReactions store={this.store} />

        <span className="flex flex-wrap items-start justify-between">
          <LinkedSection h="h1" kind="What's this all about?" />
          <LanguagePicker currentPath={'/'} />
        </span>

        <p>
          <T kind="I wanted to make some fun designs, and had just read about [...]" />
        </p>

        <p>
          <T
            kind="Read on, or skip straight to <link>the Emulator</link>."
            link={(content) => <LocaleLink href="/emulate">{content}</LocaleLink>}
          />
        </p>

        <LinkedSection h="h2" kind="One-dimensional Cellular Automata" />

        <p>
          <T
            kind="Cellular automata are a kind of zero-player game [...]"
            link={(content) => (
              <WithTFns>
                {({ t }) => (
                  <a href={t('https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life')}>{content}</a>
                )}
              </WithTFns>
            )}
          />
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
              className={clsx('md:flex', {
                hidden: i > 21,
                'sm:flex': i < 34,
              })}
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
          {range(18).map((i) => (
            <EmptyCell
              key={i}
              className={clsx('rounded-md border border-white bg-slate-300 md:flex', {
                hidden: i > 8,
                'sm:flex': i < 15,
              })}
            />
          ))}
          <Cell state={0} colorPicker={this.store.colorPicker} />
          <Cell state={0} colorPicker={this.store.colorPicker} />
          <Cell state={0} colorPicker={this.store.colorPicker} />
          {range(19).map((i) => (
            <EmptyCell
              key={i}
              className={clsx('rounded-md border border-white bg-slate-300 md:flex', {
                hidden: i > 9,
                'sm:flex': i < 16,
              })}
            />
          ))}
        </span>

        <p>
          <T
            kind="In general, there are <link>many, many types of [...]"
            link={(content) => <a href="https://cell-auto.com/neighbourhood/">{content}</a>}
          />
        </p>

        <Neighbors store={this.store} />

        <LinkedSection h="h3" kind="Transition Rules" />

        <p>
          <T
            kind="Once the number of states and the neighborhood [...]"
            tag={(content) => <code>{content}</code>}
            nextState={<code>{this.store.automata.rules[0]}</code>}
          />
        </p>

        <Rule ruleIndex={0} state={this.store.automata.rules[0]} store={this.store} />

        <legend>
          (<T kind="Clicking the rule changes the resulting state." />)
        </legend>

        <p>
          <T kind="These transition rules can be encoded as a single number, [...]" />
        </p>

        <p>
          (
          <T
            kind="This representation of the transition rules as a [...]"
            link={(content) => <a href="https://en.wikipedia.org/wiki/Wolfram_code">{content}</a>}
          />
          )
        </p>

        <LinkedSection h="h2" kind="Emulation" />

        <p>
          <T kind="Once the automaton is configured, this site emulates it by [...]" />
        </p>

        <p>
          <LocaleLink href="/emulate">
            <T kind="Go here to use the emulator." />
          </LocaleLink>
        </p>

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
