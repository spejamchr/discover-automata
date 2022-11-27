import clsx from 'clsx';
import { observer } from 'mobx-react';
import Link from 'next/link';
import React from 'react';
import { automataCtor } from '../../utils/CellularAutomata';
import { Neighbors } from '../../utils/CellularAutomata/Types';
import HistoryWithWidth from '../Emulator/RenderState/HistoryWithWidth';
import ReadonlyRules from '../Emulator/RenderState/Rules/ReadonlyRules';
import Store from '../Emulator/Store';
import { displaySettings, randomCells } from '../Emulator/Types';
import EmulatorLink from '../EmulatorLink';
import LocaleLinks from '../LocaleLinks';

interface Props {}

const tileStore = (neighbors: Neighbors, ruleId: number): Store =>
  new Store(
    displaySettings(false, true, randomCells()),
    automataCtor({ states: 2, neighbors: neighbors, ruleId: BigInt(ruleId) }),
  );

const Explanation: React.FC<Props> = () => {
  const checkered = tileStore([0], 1);
  const striped = tileStore([0], 2);
  const stripedAndCheckered = tileStore([-1, 0, 1], 150);

  striped.settings.firstGeneration = checkered.settings.firstGeneration;
  stripedAndCheckered.settings.firstGeneration = checkered.settings.firstGeneration;

  const backgroundColor = checkered.colorPicker(0)[0];
  const color = checkered.colorPicker(checkered.automata.states - 1)[0];
  return (
    <div className="prose mx-2 dark:prose-invert sm:mx-12">
      <p className="flex justify-center text-sm">
        <LocaleLinks />
      </p>

      <h1>What are cellular automata?</h1>

      <p className={clsx('text-sm')}>
        Read on, or visit{' '}
        <EmulatorLink color={color} backgroundColor={backgroundColor} children={'the emulator'} />.
      </p>

      <p>
        Icarus and Daedalus have been tasked with tiling a giant wall with square tiles. The tiles
        come in two colors: black and white. The clients want the wall to be tiled in a grid one row
        at a time, starting at the top. The clients don't care at all how the black & white tiles
        are arranged in the grid.
      </p>

      <p>
        Icarus and Daedalus begin tiling. The first row ends up looking pretty random, since they
        didn't pay much attention to which colors they were using as they went. (They were too busy
        telling each other old stories.) It looks like this.
      </p>

      <HistoryWithWidth store={striped} height={1} />

      <p>
        As they tile the second row, Daedalus convinces Icarus to play a (very boring) game: when
        they're picking the tile to use, they always use the same color as the one in the same place
        in the first row. When they finish the second row, it looks like this.
      </p>

      <HistoryWithWidth store={striped} height={2} />

      <p>
        They do some more rows like this: when they lay down a tile, they make sure it's always the
        same color as whatever tile is just above it.
      </p>

      <HistoryWithWidth store={striped} height={4} />

      <p>
        Daedalus gets bored with simple stripes and decides to change the rule, just a little. He
        decides that when they lay down a tile, they'll make it the opposite color from what's just
        above it. They do four more rows, now following the new rule, and the wall now looks like
        this:
      </p>

      <HistoryWithWidth store={striped} height={3} />
      <HistoryWithWidth store={checkered} height={5} />

      <p>
        Daedalus describes this "almost-checkered" rule with a picture: he draws a white tile above
        with a black tile under it, and a black tile with a white tile underneath.
      </p>

      <ReadonlyRules store={checkered} />

      <p>
        Icarus points out that the pattern is pretty repetitive. When deciding on a new tile's
        color, they've only been considering the color of the tile right above it. Icarus suggests
        that they could consider the colors of the tiles to the left & right as well. Daedalus likes
        the idea and suggests a new rule: if the left & right tiles are the same color, use the
        color of the tile right above it; otherwise, use the opposite color of the previous tile.
      </p>

      <p>
        This new rule sounds more complicated than the others, so Icarus suggests that they draw a
        picture of the rule, like before. This time they draw these eight pictures.
      </p>

      <ReadonlyRules store={stripedAndCheckered} />

      <p>
        Icarus is doubtful that the new pattern will be interesting; after all, it's just a
        combination of the "striped" and "almost-checkered" rules they were using before: use the
        "stripes" rule if the left & right tiles are the same color, and use the "almost-checkered"
        rule if the left & right tiles are different. But he goes along with Daedalus's idea.
      </p>

      <p>
        Starting off with the last row from the "almost-checkered" section, they add a new row
        following the new rule.
      </p>

      <HistoryWithWidth store={stripedAndCheckered} height={2} />

      <p>They add more rows.</p>

      <HistoryWithWidth store={stripedAndCheckered} height={4} />

      <p>
        It takes a little while for them to get used to this new rule, and they have to look at the
        drawing they made a bunch to remember what color tile to use, but it's definitely not as
        boring as the other two rules. Icarus and Daedalus decide to tile the rest of the wall with
        this rule, to see if it makes some kind of larger pattern, or if it just looks random.
      </p>

      <HistoryWithWidth store={stripedAndCheckered} height={30} />

      <p>
        They decide that it seems to be mostly random, with some nice almost-triangle-shaped areas.
      </p>

      <p>The wall is now fully tiled. Here's how it turned out.</p>

      <HistoryWithWidth store={striped} height={3} />
      <HistoryWithWidth store={checkered} height={4} />
      <HistoryWithWidth store={stripedAndCheckered} height={30} />

      <p>
        It probably won't win any artistic prizes, but Icarus and Daedalus have used cellular
        automata to tile the wall. Each "rule" that they came up with was a different cellular
        automaton.
      </p>

      <p>
        At their simplest, a cellular automaton is a set of rules for deciding how to tile
        something. That something can be a wall, or an infinite plane, or the surface of a sphere,
        or almost anything you want.
      </p>

      <p>
        The rules can be very simple, like the "striped" and "almost-checkered" rules, or can get
        more complicated, like the last "combined" rule that Daedalus suggested. Also, cellular
        automata aren't limited to only two colors, and usually use numbers in place of colors.
      </p>

      <p>
        The cellular automata drawn in this story and at{' '}
        <EmulatorLink color={color} backgroundColor={backgroundColor} children={'the emulator'} />{' '}
        are all drawn row-by-row, to make a single grid of cells. Other cellular automata might
        start with a full grid, and then have rules for making a new grid. By drawing many new grids
        over and over, they can make simple animations.
      </p>

      <p>Also check out:</p>

      <ul>
        <li>
          <Link href="https://en.wikipedia.org/wiki/Cellular_automaton">Wikipedia</Link> for more
          info and a deep rabbit-hole of related articles.
        </li>
        <li>
          <Link href="https://mathworld.wolfram.com/CellularAutomaton.html">Wolfram MathWorld</Link>{' '}
          for lots of numbers and graphs.
        </li>
        <li>
          <Link href="https://golly.sourceforge.net/">Golly</Link>, a program you can use to make &
          play with all sorts of cellular automata.
        </li>
      </ul>
    </div>
  );
};

export default observer(Explanation);
