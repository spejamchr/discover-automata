import { stringLiteral } from '@execonline-inc/decoders';
import Decoder, { oneOf } from 'jsonous';
import { just, Maybe, nothing } from 'maybeasy';
import * as React from 'react';
import { assertIs } from '../Assert';
import { range } from '../Range';
import { en } from './en';
import { ja } from './ja';
import { pt } from './pt';

export const locales = ['en', 'ja', 'pt'] as const;

export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

const localeDecoder: Decoder<Locale> = oneOf(locales.map(stringLiteral));

export const whenLocale = (s: string): Maybe<Locale> =>
  localeDecoder.decodeAny(s).map(just).getOrElse(nothing);

export const constrainToLocale = assertIs(localeDecoder);

// Keep these lines less than 70 characters long and sorted
const plainTextTranlations = [
  `(Clicking the rule changes the resulting state.)`,
  `(First generation)`,
  `(Next generation)`,
  `A simple example of a neighborhood is the current cell and [...]`,
  `A weather simulation can be used for predictions, but [...]`,
  `Automaton`,
  `Configuration`,
  `Description of the automaton...`,
  `Discover Automata`,
  `Displaying in color`,
  `Displaying in grayscale`,
  `Each cell in a cellular automata can be in one of several [...]`,
  `Emulate 1D cellular automata in the browser`,
  `Emulator`,
  `Favorites`,
  `Go here to use the emulator.`,
  `Hiding state labels`,
  `Hue`,
  `I called this an "emulator" instead of a "simulator," [...]`,
  `I wanted to make some fun designs, and had just read about [...]`,
  `In this simulation, you can set the number of states the [...]`,
  `Neighbors`,
  `Once the automaton is configured, this site emulates it by [...]`,
  `One-dimensional Cellular Automata`,
  `One-dimensional cellular automata (1DCA) are a kind of [...]`,
  `Overflow Error: please use smaller numbers`,
  `Randomize`,
  `Recreate Default Favorites`,
  `Rule 110: Turing-complete!`,
  `Rule 184: The "traffic rule"`,
  `Rule 30: Mathematica used this as an RNG`,
  `Rule 90: The exclusive-or function`,
  `Rule Number`,
  `Settings`,
  `Showing state labels`,
  `Something went wrong... Refresh to try again.`,
  `Starting with Random Cells`,
  `Starting with Single Cell`,
  `States`,
  `These transition rules can be encoded as a single number, [...]`,
  `To define a 1DCA we need to know three things: the number [...]`,
  `Transition Rules`,
  `What's this all about?`,
  `When using a (good) video game emulator, the video game [...]`,
  `https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life`,
  `maximum digits:`,
  `native-locale-name`,
] as const;

interface PlainTextTranslation {
  kind: typeof plainTextTranlations[number];
  translation: string;
}

export type PlainTextKey = PlainTextTranslation['kind'];

export type PlainTextTranslator = (kind: PlainTextKey) => string;

type Replacer = React.ReactElement;

type Replacement<key extends string> = `{{${key}}}`;

type Replaces<key extends string> = `${string}${Replacement<key>}${string}`;

type Tagger = (node: React.ReactNode) => Replacer;

type Tagged<key extends string> = `<${key}>${string}</${key}>`;

type Tags<key extends string> = `${string}${Tagged<key>}${string}`;

// Keep these lines less than 70 characters long and sorted by kind
type ParameterizedTranslation =
  | {
      kind: 'Cellular automata are a kind of zero-player game [...]';
      link: Tagger;
      translation: Tags<'link'>;
    }
  | {
      kind: 'In general, there are <link>many, many types of [...]';
      link: Tagger;
      translation: Tags<'link'>;
    }
  | {
      kind: 'Once the number of states and the neighborhood [...]';
      tag: Tagger;
      nextState: Replacer;
      translation: Replaces<'nextState'> & Tags<'tag'>;
    }
  | {
      kind: 'Read on, or skip straight to <link>the emulator</link>.';
      link: Tagger;
      translation: Tags<'link'>;
    }
  | {
      kind: 'This representation of the transition rules as a [...]';
      link: Tagger;
      translation: Tags<'link'>;
    };

type PlainTextTranslations = { [K in PlainTextTranslation['kind']]: string };

type ParameterizedTranslations = { [K in ParameterizedTranslation as K['kind']]: K['translation'] };

export type Translations = PlainTextTranslations & ParameterizedTranslations;

type AllTranslations = { [L in Locale]: Translations };

const allTranslations: AllTranslations = {
  en,
  ja,
  pt,
};

const replaceString =
  (tag: string, replacer: Replacer) =>
  (replaceable: string | Replacer): Array<string | Replacer> => {
    if (typeof replaceable === 'object') return [replaceable];
    const strings = replaceable.split(`{{${tag}}}`);
    return range(strings.length * 2 - 1).map((i) => (i % 2 === 0 ? strings[i / 2] : replacer));
  };

const doReplace = (
  tag: string,
  replaceable: ReadonlyArray<string | Replacer>,
  replacer: Replacer,
): Array<string | Replacer> => {
  return replaceable.flatMap(replaceString(tag, replacer));
};

// Argh! So imperative!
const doTag = (tag: string, tagged: ReadonlyArray<string | Replacer>, fn: Tagger) => {
  const first: Array<string | Replacer> = [];
  const body: Array<string | Replacer> = [];
  const last: Array<string | Replacer> = [];

  const open = `<${tag}>`;
  const close = `</${tag}>`;

  let i = 0;
  while (i < tagged.length) {
    const e = tagged[i];
    i++;
    if (typeof e === 'string') {
      if (e.indexOf(open) === -1) {
        first.push(e);
      } else {
        const [p, ...ms] = e.split(open);
        first.push(p);
        const m = ms.join('');
        if (m.indexOf(close) === -1) {
          body.push(m);
        } else {
          const [b, ...l] = m.split(close);
          body.push(b);
          last.push(l.join(''));
        }
        break;
      }
    } else {
      first.push(e);
    }
  }

  if (last.length === 0) {
    while (i < tagged.length) {
      const e = tagged[i];
      i++;
      if (typeof e === 'string') {
        if (e.indexOf(close) === -1) {
          body.push(e);
        } else {
          const [b, ...l] = e.split(close);
          body.push(b);
          last.push(l.join(''));
          break;
        }
      } else {
        body.push(e);
      }
    }
  }

  while (i < tagged.length) {
    last.push(tagged[i]);
    i++;
  }

  const element = fn(React.createElement(React.Fragment, {}, ...body));

  return [...first, element, ...last];
};

const parameterizeTranslation = (arg: ParameterizedTranslation): React.ReactNode => {
  switch (arg.kind) {
    case 'Cellular automata are a kind of zero-player game [...]':
    case 'In general, there are <link>many, many types of [...]':
    case 'Read on, or skip straight to <link>the emulator</link>.':
    case 'This representation of the transition rules as a [...]': {
      const tagged = doTag('link', [arg.translation], arg.link);
      return React.createElement(React.Fragment, {}, ...tagged);
    }
    case 'Once the number of states and the neighborhood [...]': {
      const replaced = doReplace('nextState', [arg.translation], arg.nextState);
      const tagged = doTag('tag', replaced, arg.tag);
      return React.createElement(React.Fragment, {}, ...tagged);
    }
  }
};

type PlainTextProps = Omit<PlainTextTranslation, 'translation'>;

type ParameterizedProps2 = {
  [K in ParameterizedTranslation as K['kind']]: Omit<K, 'translation'>;
};

export type ParameterizedProps = ParameterizedProps2[keyof ParameterizedProps2];

const isPlainTextArg = (arg: { kind: string }): arg is PlainTextProps => {
  return plainTextTranlations.find((t) => t === arg.kind) !== undefined;
};

export type TranslationProps = PlainTextProps | ParameterizedProps;

export function translate(locale: Locale, arg: ParameterizedProps): React.ReactNode;
export function translate(locale: Locale, arg: PlainTextProps): string;
export function translate(locale: Locale, arg: TranslationProps) {
  if (isPlainTextArg(arg)) {
    return allTranslations[locale][arg.kind];
  } else {
    return parameterizeTranslation({
      ...arg,
      translation: allTranslations[locale][arg.kind],
    } as ParameterizedTranslation); // DANGER using as...
  }
}

export const makeTranslator = <L extends Locale>(locale: L) => {
  const Translator = (args: TranslationProps): React.ReactElement => {
    if (isPlainTextArg(args)) {
      return React.createElement(React.Fragment, null, translate(locale, args));
    }
    return React.createElement(React.Fragment, null, translate(locale, args));
  };
  Translator.displayName = `Translator[${locale}]`;
  return Translator;
};

export interface LocaleContextArgs {
  locale: Locale;
  Translator: ReturnType<typeof makeTranslator>;
}

export const LocaleContext = React.createContext<LocaleContextArgs>({
  locale: defaultLocale,
  Translator: makeTranslator(defaultLocale),
});
