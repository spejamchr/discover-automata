import clsx from 'clsx';
import { observer } from 'mobx-react';
import Link from 'next/link';
import React from 'react';
import { automataCtor, serialize } from '../../utils/CellularAutomata';
import { Neighbors } from '../../utils/CellularAutomata/Types';
import HistoryWithWidth from '../Emulator/RenderState/HistoryWithWidth';
import ReadonlyRules from '../Emulator/RenderState/Rules/ReadonlyRules';
import Store from '../Emulator/Store';
import { displaySettings, randomCells } from '../Emulator/Types';
import EmulatorLink from '../EmulatorLink';
import LinkedSection from '../LinkedSection';
import LinkTo from '../LocaleLink/LinkTo';

interface Props {}

const tileStore = (neighbors: Neighbors, ruleId: number): Store =>
  new Store(
    displaySettings(false, true, randomCells()),
    automataCtor({ states: 2, neighbors: neighbors, ruleId: BigInt(ruleId) }),
  );

const Explanation: React.FC<Props> = () => {
  const checkered = tileStore([0], 1);
  const striped = tileStore([0], 2);
  const trianglesLight = tileStore([-1, 0], 9);
  const trianglesDark = tileStore([-1, 0], 6);

  striped.settings.firstGeneration = checkered.settings.firstGeneration;
  trianglesLight.settings.firstGeneration = checkered.settings.firstGeneration;
  trianglesDark.settings.firstGeneration = checkered.settings.firstGeneration;

  const backgroundColor = checkered.colorPicker(0)[0];
  const color = checkered.colorPicker(checkered.automata.states - 1)[0];
  return (
    <div className="prose mx-2 dark:prose-invert sm:mx-12">
      <LinkedSection h="h1" kind="What are Cellular Automata?" />

      <p className={clsx('text-sm')}>
        Read on, or visit{' '}
        <EmulatorLink color={color} backgroundColor={backgroundColor}>
          the emulator
        </EmulatorLink>
        .
      </p>

      <LinkedSection h="h1" kind="Icarus and Daedalus Tile a Wall" />

      <p>
        Icarus and Daedalus have been hired to tile a wall with square tiles. The tiles come in two
        colors: black and white. The clients want the wall to be tiled in a grid one row at a time,
        starting at the top. The clients oddly don't care how the black & white tiles are arranged
        in the grid.
      </p>

      <p>
        Icarus and Daedalus begin tiling. The first row ends up looking pretty random, since they
        didn't pay much attention to which colors they were using as they went. (They were too busy
        telling each other old stories.) Here it is.
      </p>

      <HistoryWithWidth store={striped} height={1} />

      <p>
        Before they tile the second row, Daedalus convinces Icarus to play a (very boring) game:
        when they place a tile, they always use the same color as the tile in the same position in
        the first row. When they finish the second row, it looks like this.
      </p>

      <HistoryWithWidth store={striped} height={2} />

      <p>
        They do some more rows like this: when they lay down a tile, they make sure it's the same
        color as the tile just above it.
      </p>

      <HistoryWithWidth store={striped} height={4} />

      <p>
        Icarus gets bored with the simple striping pattern this creates and wants to change the
        rule, just a little. He decides that when they lay down a tile, they'll make it the opposite
        of the "parent" tile&mdash;the one just above it. They tile some more rows, now following
        the new rule, and the second section of the wall makes a sort of checkered pattern.
      </p>

      <HistoryWithWidth store={striped} height={3} />
      <HistoryWithWidth store={checkered} height={5} />

      <p>
        Daedalus describes this "almost-checkered" rule with two pictures: one with a black tile
        above and a white tile underneath, and another with a white tile above and a black tile
        underneath. Each picture shows them which color to use given the color of the "parent" tile
        above. Daedalus calls these pictures the "transition rules" for their tiling game.
      </p>

      <ReadonlyRules store={checkered} />

      <p>
        Icarus points out that both patterns have been pretty repetitive. When deciding on a new
        tile's color, they've only been considering the color of the tile right above it. He
        suggests that the patterns could be more interesting if they considered two tiles: the
        parent tile and the tile to the left of the parent tile. Daedalus agrees and suggests a new
        rule: if the two tiles above are the same color use black, and if they're different use
        white.
      </p>

      <p>
        This new rule is more complicated than the others, so Icarus asks Daedalus to draw another
        picture of the "transition rules," like before. This time they draw four pictures. Each one
        shows which color tile to use for a given combination of neighboring parent tiles.
      </p>

      <ReadonlyRules store={trianglesLight} className="dark:hidden" />
      <ReadonlyRules store={trianglesDark} className="hidden dark:flex" />

      <p>
        Icarus is doubtful that the new pattern will be interesting; after all, it's just a
        combination of the "striped" and "almost-checkered" rules they were using before: use the
        "stripes" rule if the left tile is black, and use the "almost-checkered" rule if the left
        tile is white. But he goes along with Daedalus's idea.
      </p>

      <p>
        Starting off with the last row from the "almost-checkered" section, they add a new row
        following the new rule.
      </p>

      <HistoryWithWidth store={trianglesLight} height={2} className="dark:hidden" />
      <HistoryWithWidth store={trianglesDark} height={2} className="hidden dark:block" />

      <p>
        It takes a little while for them to get used to this new rule, and they have to look at the
        drawing they made to remember what color tile to use, but it's definitely not as boring as
        the other two rules. Icarus and Daedalus decide to tile several more rows following this
        rule, to see if it makes some kind of larger pattern.
      </p>

      <HistoryWithWidth store={trianglesLight} height={10} className="dark:hidden" />
      <HistoryWithWidth store={trianglesDark} height={10} className="hidden dark:block" />

      <p>
        They decide that it seems to be mostly random, except that it sometimes makes black
        triangles.
      </p>

      <p>The wall is now fully tiled. Here's how it turned out.</p>

      <HistoryWithWidth store={striped} height={3} />
      <HistoryWithWidth store={checkered} height={4} />
      <HistoryWithWidth store={trianglesLight} height={30} className="dark:hidden" />
      <HistoryWithWidth store={trianglesDark} height={30} className="hidden dark:block" />

      <p>
        It probably won't win any artistic prizes, but Icarus and Daedalus have used cellular
        automata to tile the wall. Each "rule" that they came up with was a different cellular
        automaton.
      </p>

      <LinkedSection h="h2" kind="Finishing Touches" />

      <p>
        Put simply, a cellular automaton is a set of rules for deciding how to tile something (note
        that the cellular automaton is the set of rules, and not the final tiling itself). That
        something can be a wall, or an infinite plane, or the surface of a sphere, or almost any
        surface you can think of.
      </p>

      <p>
        The rules can be very simple, like the "striped" and "almost-checkered" rules, and can get
        more complicated than even the last "triangle" rule that Daedalus suggested. For example,
        cellular automata aren't limited to only two colors, and usually use numbers in place of
        colors.
      </p>

      <p>You can view the rules from this story in the emulator on this site.</p>

      <ol>
        <li>
          <LinkTo href={`/emulate#${serialize(striped.automata)}`}>The "striped" rule</LinkTo>
        </li>
        <li>
          <LinkTo href={`/emulate#${serialize(checkered.automata)}`}>
            The "almost-checkered" rule
          </LinkTo>
        </li>
        <li>
          <LinkTo href={`/emulate#${serialize(trianglesLight.automata)}`} className="dark:hidden">
            The "triangle" rule
          </LinkTo>
          <LinkTo
            href={`/emulate#${serialize(trianglesDark.automata)}`}
            className="hidden dark:inline"
          >
            The "triangle" rule
          </LinkTo>
        </li>
      </ol>

      <p>
        The cellular automata drawn in this story and at{' '}
        <EmulatorLink color={color} backgroundColor={backgroundColor}>
          the emulator
        </EmulatorLink>{' '}
        are all drawn row-by-row, to make a single grid of cells. Many other cellular automata start
        with a full grid, and then have rules for drawing a new grid. By drawing many new grids over
        and over, they can make simple animations. The most well-known cellular automaton,{' '}
        <Link href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">
          Conway's Game of Life
        </Link>
        , works like this.
      </p>

      <p>Here are some other nice resources to learn about or play with cellular automata.</p>

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
          <Link href="https://golly.sourceforge.net/">Golly</Link>, a program you can run locally to
          make & play with all sorts of cellular automata.
        </li>
      </ul>
    </div>
  );
};

export default observer(Explanation);
