import { Translations } from '../Types';

// prettier-ignore
//
// Formatting:
// - Each key/value entry should be on the same line
// - Use "double quotes" around keys & values
// - Sort entries alphabetically
// - Use a comma on the last line
export const en: Translations = {
  "(Clicking the rule changes the resulting state.)": "(Clicking the rule changes the resulting state.)",
  "(First generation)": "(First generation)",
  "(Next generation)": "(Next generation)",
  "A simple example of a neighborhood is the current cell and [...]": "A simple example of a neighborhood is the current cell and its two immediate neighbors, such as:",
  "A weather simulation can be used for predictions, but [...]": "A weather simulation can be used for predictions, but doesn't perfectly match reality.",
  "Automaton":"Automaton",
  "Cellular automata are a kind of zero-player game [...]": "Cellular automata are a kind of zero-player game played on a \"universe\" of tiled \"cells.\" Each automaton has its own configuration, and can evolve a universe through many generations. The most well-known cellular automaton is probably <link>Conway's Game of Life</link>.",
  "Configuration": "Configuration",
  "Description of the automaton...": "Description of the automaton...",
  "Discover Automata": "Discover Automata",
  "Display Settings": "Display Settings",
  "Displaying in color": "Displaying in color",
  "Displaying in grayscale": "Displaying in grayscale",
  "Each cell in a cellular automata can be in one of several [...]": "Each cell in a cellular automata can be in one of several states, most often represented as a number (like 0 or 1) or a color (like black or white).",
  "Emulate 1D cellular automata in the browser": "Emulate 1D cellular automata in the browser",
  "Emulator": "Emulator",
  "Favorites":"Favorites",
  "Go here to use the emulator.": "Go here to use the emulator.",
  "Hiding state labels": "Hiding state labels",
  "Hue": "Hue",
  "I called this an \"emulator\" instead of a \"simulator,\" [...]": "I called this an \"emulator\" instead of a \"simulator,\" because simulators are expected to approximate the thing they simulate, while the goal of an emulator is to recreate the behavior of the thing it emulates exactly.",
  "I wanted to make some fun designs, and had just read about [...]": "I wanted to make some fun designs, and had just read about one-dimensional cellular automata, so this site was born.",
  "In general, there are <link>many, many types of [...]": "In general, there are <link>many, many types of neighborhoods</link> that can be used to create cellular automata (including neighboorhoods that can change with time). However, neighborhoods used on this site are limited to a selection of the current cell and several of its closest neighbors on each side.",
  "In this emulator, you can set the number of states the [...]": "In this emulator, you can set the number of states the cellular automaton has.",
  "Neighbors": "Neighbors",
  "Once the automaton is configured, this site emulates it by [...]": "Once the automaton is configured, this site emulates it by generating a random initial generation and then drawing many children generations.",
  "Once the number of states and the neighborhood [...]": "Once the number of states and the neighborhood have been selected, the transition rules must be determined. For every possible combination of states in the given neighborhood, the resulting state must be chosen. As an example, here is the transition rule saying that if all of a cell's neighbors are <tag>0</tag> then the cell should become {{nextState}}:",
  "One-dimensional Cellular Automata": "One-dimensional Cellular Automata",
  "One-dimensional cellular automata (1DCA) are a kind of [...]": "One-dimensional cellular automata (1DCA) are a kind of cellular automata where the tiling is 1D; we can think of it as a line of squares. This makes the many generations of a 1DCA easy to draw: we can draw all the generation lines one after another to form a rectangle.",
  "Randomize": "Randomize",
  "Read on, or skip straight to <link>the emulator</link>.": "Read on, or skip straight to <link>the emulator</link>.",
  "Recreate Default Favorites": "Recreate Default Favorites",
  "Rule 110: Turing-complete!": "Rule 110: Turing-complete!",
  "Rule 184: The \"traffic rule\"": "Rule 184: The \"traffic rule\"",
  "Rule 30: Mathematica used this as an RNG": "Rule 30: Mathematica used this as an RNG",
  "Rule 90: The exclusive-or function": "Rule 90: The exclusive-or function",
  "Rule Number": "Rule Number",
  "Settings":"Settings",
  "Showing state labels": "Showing state labels",
  "Something went wrong... Refresh to try again.": "Something went wrong... Refresh to try again.",
  "Starting with Random Cells": "Starting with Random Cells",
  "Starting with Single Cell": "Starting with Single Cell",
  "States": "States",
  "The emulator can be rendered in color or in grayscale.": "The emulator can be rendered in color or in grayscale.",
  "The first generation of cells can be created randomly, or [...]": "The first generation of cells can be created randomly, or as a single non-zero cell surrounded by zero cells.",
  "The hue can be adjusted to render the emulator using [...]": "The hue can be adjusted to render the emulator using different colors.",
  "The numeric labels can be toggled on or off.": "The numeric labels can be toggled on or off.",
  "There are several settings that control how the emulator is [...]": "There are several settings that control how the emulator is displayed:",
  "These transition rules can be encoded as a single number, [...]": "These transition rules can be encoded as a single number, the \"rule number,\" which can also be used to change the transition rules.",
  "This representation of the transition rules as a [...]": "This representation of the transition rules as a \"rule number\" uses the <link>Wolfram Code</link>.",
  "To define a 1DCA we need to know three things: the number [...]": "To define a 1DCA we need to know three things: the number of states to use, which neighbors to consider when calculating the next generation, and the transition rules for deciding which state a cell will evolve into (based on the states of its neighbors).",
  "Transition Rules": "Transition Rules",
  "What's this all about?": "What's this all about?",
  "When using a (good) video game emulator, the video game [...]": "When using a (good) video game emulator, the video game can't tell it's running on an emulator, because the emulator behaves exactly like the system it is emulating.",
  "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life": "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
  "maximum digits:": "maximum digits:",
  "native-locale-name": "English",
};
