import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { automataCtor } from '../../utils/CellularAutomata';
import T from '../../utils/Locales/T';
import { LocaleContext, sortedLocales } from '../../utils/Locales/Types';
import WithTFns from '../../utils/Locales/WithTFns';
import { range } from '../../utils/Range';
import Cell from '../Emulator/Generations/Cell';
import EmptyCell from '../Emulator/Generations/EmptyCell';
import ConfigureRuleId from '../Emulator/RenderState/Configuring/ConfigureRuleId';
import Neighbors from '../Emulator/RenderState/Configuring/Neighbors';
import States from '../Emulator/RenderState/Configuring/States';
import HistoryWithWidth from '../Emulator/RenderState/HistoryWithWidth';
import Rule from '../Emulator/RenderState/Rules/Rule';
import Store from '../Emulator/Store';
import { displaySettings, randomCells } from '../Emulator/Types';
import LinkedSection from '../LinkedSection';
import CurrentPageInLocale from '../LocaleLink/CurrentPageInLocale';
import LinkTo from '../LocaleLink/LinkTo';
import Togglers from '../Togglers';

interface Props {}

const simpleAutomaton = automataCtor({
  states: 2,
  neighbors: [-1, 0, 1],
  ruleId: BigInt(3),
});

class Explanation extends React.Component<Props> {
  store = new Store(displaySettings(true, true, randomCells()), simpleAutomaton);

  render() {
    const backgroundColor = this.store.colorPicker(0)[0];
    const color = this.store.colorPicker(this.store.automata.states - 1)[0];
    return (
      <div className="prose mx-2 dark:prose-invert sm:mx-12">
        <p className="flex justify-center text-sm">
          <LocaleContext.Consumer>
            {({ locale: currentLocale }) =>
              sortedLocales.map(({ nativeLocale, locale }, i) => {
                const lang =
                  locale === currentLocale ? (
                    <span>{nativeLocale}</span>
                  ) : (
                    <CurrentPageInLocale locale={locale}>{nativeLocale}</CurrentPageInLocale>
                  );
                const separator =
                  i === sortedLocales.length - 1 ? <></> : <span className="mx-2"> - </span>;
                return (
                  <React.Fragment key={locale}>
                    {lang}
                    {separator}
                  </React.Fragment>
                );
              })
            }
          </LocaleContext.Consumer>
        </p>

        <LinkedSection h="h1" kind="What's this all about?" />

        <p>
          <T kind="I wanted to make some fun designs, and had just read about [...]" />
        </p>

        <p>
          <T
            kind="Read on, or skip straight to <link>the emulator</link>."
            link={(content) => (
              <>
                <span className="relative hidden dark:inline dark:hue-rotate-[180deg] dark:invert">
                  <span
                    style={{ backgroundColor: color }}
                    className="absolute -inset-1 mx-0.5 block -skew-y-3 -skew-x-6 transition-colors duration-500"
                    aria-hidden
                  />
                  <LinkTo
                    style={{ color: backgroundColor }}
                    className="relative transition-colors duration-500 "
                    href="/emulate"
                  >
                    {content}
                  </LinkTo>
                </span>
                <span className="relative dark:hidden">
                  <span
                    style={{ backgroundColor }}
                    className="absolute -inset-1 mx-0.5 block -skew-y-3 -skew-x-6 transition-colors duration-500"
                    aria-hidden
                  />
                  <LinkTo
                    style={{ color }}
                    className="relative transition-colors duration-500 "
                    href="/emulate"
                  >
                    {content}
                  </LinkTo>
                </span>
              </>
            )}
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
                  <td
                    key={i}
                    className="h-8 w-8 border border-slate-700 text-center dark:border-slate-300"
                  />
                ))}
                <td className="pl-2">
                  <T kind={r === 0 ? '(First generation)' : '(Next generation)'} />
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

        <HistoryWithWidth store={this.store} height={1} />

        <p>
          <T kind="In this emulator, you can set the number of states the [...]" />
        </p>

        <States store={this.store} />

        <LinkedSection h="h3" kind="Neighbors" />

        <p>
          <T kind="A simple example of a neighborhood is the current cell and [...]" />
        </p>

        <span className="flex">
          {range(18).map((i) => (
            <EmptyCell
              key={i}
              className={clsx(
                'rounded-md border border-slate-50 bg-slate-300 dark:border-slate-900 dark:bg-slate-700 md:flex',
                {
                  hidden: i > 8,
                  'sm:flex': i < 15,
                },
              )}
            />
          ))}
          <Cell state={0} colorPicker={this.store.colorPicker} />
          <Cell state={0} colorPicker={this.store.colorPicker} />
          <Cell state={0} colorPicker={this.store.colorPicker} />
          {range(19).map((i) => (
            <EmptyCell
              key={i}
              className={clsx(
                'rounded-md border border-slate-50 bg-slate-300 dark:border-slate-900 dark:bg-slate-700 md:flex',
                {
                  hidden: i > 9,
                  'sm:flex': i < 16,
                },
              )}
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
          <T kind="(Clicking the rule changes the resulting state.)" />
        </legend>

        <p>
          <T kind="These transition rules can be encoded as a single number, [...]" />
        </p>

        <ConfigureRuleId store={this.store} />

        <p>
          (
          <T
            kind="This representation of the transition rules as a [...]"
            link={(content) => <a href="https://en.wikipedia.org/wiki/Wolfram_code">{content}</a>}
          />
          )
        </p>

        <LinkedSection h="h2" kind="Emulator" />

        <p>
          <T kind="Once the automaton is configured, this site emulates it by [...]" />
        </p>

        <p>
          <span className="relative hidden dark:inline dark:hue-rotate-[180deg] dark:invert">
            <span
              style={{ backgroundColor: color }}
              className="absolute -inset-1 mx-0.5 block -skew-y-1 -skew-x-12 transition-colors duration-500"
              aria-hidden
            />
            <LinkTo
              style={{ color: backgroundColor }}
              className="relative transition-colors duration-500"
              href="/emulate"
            >
              <T kind="Go here to use the emulator." />
            </LinkTo>
          </span>
          <span className="relative dark:hidden">
            <span
              style={{ backgroundColor }}
              className="absolute -inset-1 mx-0.5 block -skew-y-1 -skew-x-12 transition-colors duration-500"
              aria-hidden
            />
            <LinkTo
              style={{ color }}
              className="relative transition-colors duration-500"
              href="/emulate"
            >
              <T kind="Go here to use the emulator." />
            </LinkTo>
          </span>
        </p>

        <HistoryWithWidth store={this.store} height={3} />

        <LinkedSection h="h3" kind={'Note on Naming'} />

        <p>
          <T kind='I called this an "emulator" instead of a "simulator," [...]' />
        </p>

        <LinkedSection h="h2" kind={'Display Settings'} />

        <p>
          <T kind={'There are several settings that control how the emulator is [...]'} />
        </p>

        <Togglers store={this.store} />

        <ul>
          <li>
            <T kind={'The numeric labels can be toggled on or off.'} />
          </li>
          <li>
            <T kind={'The emulator can be rendered in color or in grayscale.'} />
          </li>
          <li>
            <T kind={'The first generation of cells can be created randomly, or [...]'} />
          </li>
          <li>
            <T kind={'The hue can be adjusted to render the emulator using [...]'} />
          </li>
        </ul>
      </div>
    );
  }
}
export default observer(Explanation);
