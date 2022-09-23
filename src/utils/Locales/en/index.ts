import { Translations } from '../Types';

// prettier-ignore
//
// Formatting:
// - Each key/value entry should be on the same line
// - Use "double quotes" around keys & values
// - Sort entries alphabetically
// - Use a comma on the last line
export const en: Translations = {
  "A simple example of a neighborhood is the current cell and [...]": "A simple example of a neighborhood is the current cell and its two immediate neighbors, such as:",
  "A weather simulation can be used for predictions, but [...]": "A weather simulation can be used for predictions, but doesn't perfectly match reality.",
  "Cellular automata are a kind of zero-player game [...]": "Cellular automata are a kind of zero-player game played on a \"universe\" of tiled \"cells.\" Each automaton has its own configuration, and can evolve a universe through many generations. The most well-known cellular automaton is probably <link>Conway's Game of Life</link>.",
  "Clicking the rule changes the resulting state.": "Clicking the rule changes the resulting state.",
  "Configuration": "Configuration",
  "Displaying in color": "Displaying in color",
  "Displaying in grayscale": "Displaying in grayscale",
  "Each cell in a cellular automata can be in one of several [...]": "Each cell in a cellular automata can be in one of several states, most often represented as a number (like 0 or 1) or a color (like black or white).",
  "Emulate 1D cellular automata in the browser": "Emulate 1D cellular automata in the browser",
  "Emulation": "Emulation",
  "First generation": "First generation",
  "Go here to use the emulator.": "Go here to use the emulator.",
  "Hiding state labels": "Hiding state labels",
  "I called this an \"emulator\" instead of a \"simulator,\" [...]": "I called this an \"emulator\" instead of a \"simulator,\" because simulators tend to approximate the thing the simulate, while the goal of an emulator is to recreate the behavior of the thing they emulate exactly.",
  "I wanted to make some fun designs, and had just read about [...]": "I wanted to make some fun designs, and had just read about one-dimensional cellular automata, so this site was born.",
  "In general, there are <link>many, many types of [...]": "In general, there are <link>many, many types of neighborhoods</link> that can be used to create cellular automata (including neighboorhoods that can change with time). However, neighborhoods used on this site are limited to a selection of the current cell and several of its closest neighbors on each side.",
  "In this simulation, you can set the number of states the [...]": "In this simulation, you can set the number of states the cellular automaton has. You can also choose whether the simulation draws the states using grayscale or colors, and whether the number labels are shown or hidden.",
  "Neighbors": "Neighbors",
  "Next generation": "Next generation",
  "Once the automaton is configured, this site emulates it by [...]": "Once the automaton is configured, this site emulates it by generating a random initial generation and then drawing out many children generations.",
  "Once the number of states and the neighborhood [...]": "Once the number of states and the neighborhood have been selected, the transition rules must be determined. For every possible combination of states in the given neighborhood, the resulting states must be chosen. As an example, here is the transition rule saying that if all of a cell's neighbors are <tag>0</tag> then the cell should become {{nextState}}:",
  "One-dimensional Cellular Automata": "One-dimensional Cellular Automata",
  "One-dimensional cellular automata (1DCA) are a kind of [...]": "One-dimensional cellular automata (1DCA) are a kind of cellular automata where the tiling is 1D; we can think of it as a line of squares. This makes the many generations of a 1DCA easy to draw: we can draw all the generation lines one after another to form a rectangle.",
  "Overflow Error: please use smaller numbers": "Overflow Error: please use smaller numbers",
  "Randomize": "Randomize",
  "Read on, or skip straight to <link>the Emulator</link>.": "Read on, or skip straight to <link>the Emulator</link>.",
  "Rule Number": "Rule Number",
  "Showing state labels": "Showing state labels",
  "States": "States",
  "These transition rules can be encoded as a single number, [...]": "These transition rules can be encoded as a single number, the \"rule number,\" which can also be used to change the transition rules.",
  "This representation of the transition rules as a [...]": "This representation of the transition rules as a \"rule number\" uses the <link>Wolfram Code</link>.",
  "To define a 1DCA we need to know three things: the number [...]": "To define a 1DCA we need to know three things: the number of states to use, which neighbors to consider when calculating the next generation, and the transition rules for deciding which state a cell will evolve into (based on the states of its neighbors).",
  "Transition Rules": "Transition Rules",
  "Value is too long to parse; character length must be less [...]": "Value is too long to parse; character length must be less than or equal to:",
  "Value must be a number": "Value must be a number",
  "Value must not be equal to:": "Value must not be equal to:",
  "Value should be equal to:": "Value should be equal to:",
  "Value should be greater than or equal to:": "Value should be greater than or equal to:",
  "Value should be greater than:": "Value should be greater than:",
  "Value should be less than or equal to:": "Value should be less than or equal to:",
  "Value should be less than:": "Value should be less than:",
  "What's this all about?": "What's this all about?",
  "When using a (good) video game emulator, the video game [...]": "When using a (good) video game emulator, the video game can't tell it's running on an emulator, because the emulator behaves exactly like the system it is emulating.",
  "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life": "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life",
  "maximum digits:": "maximum digits:",
};
