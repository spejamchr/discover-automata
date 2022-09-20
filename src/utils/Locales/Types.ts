import { stringLiteral } from '@execonline-inc/decoders';
import Decoder, { oneOf } from 'jsonous';
import React from 'react';
import { assertIs } from '../Assert';
import { en } from './en';
import { pt } from './pt';

export const locales = ['en', 'pt'] as const;

export type Locale = typeof locales[number];

const localeDecoder: Decoder<Locale> = oneOf([
  stringLiteral<Locale>('en'),
  stringLiteral<Locale>('pt'),
]);

export const constrainToLocale = assertIs(localeDecoder);

// Keep these lines less than 70 characters long and sorted
const plainTextTranlations = [
  'Displaying in color',
  'Displaying in grayscale',
  'Emulate 1D cellular automata in the browser',
  'Hiding state labels',
  'Neighbors',
  'One-dimensional Cellular Automata',
  'Overflow Error: please use smaller numbers',
  'Randomize',
  'Rule',
  'Showing state labels',
  'States',
  'Transition Patterns',
  'Value is too long to parse; character length must be less [...]',
  'Value must be a number',
  'Value must not be equal to:',
  'Value should be equal to:',
  'Value should be greater than or equal to:',
  'Value should be greater than:',
  'Value should be less than or equal to:',
  'Value should be less than:',
  'maximum digits:',
] as const;

export type TranslationKey = typeof plainTextTranlations[number];

export type Translations = { [K in TranslationKey]: string };

type AllTranslations = { [L in Locale]: Translations };

const allTranslations: AllTranslations = {
  en,
  pt,
};

export interface TProps {
  kind: TranslationKey;
}

export type TComponent = React.FC<TProps> & { fn: (kind: TranslationKey) => string };

const translate = (locale: Locale) => {
  const translations = allTranslations[locale];
  return (kind: TranslationKey): string => translations[kind];
};

export const makeTranslator = <L extends Locale>(locale: L): TComponent => {
  const fn = translate(locale);
  const Translator = ({ kind }: TProps) => React.createElement(React.Fragment, null, fn(kind));
  Translator.displayName = `Translator[${locale}]`;
  Translator.fn = fn;
  return Translator;
};

export const TranslatorContext = React.createContext(makeTranslator('en'));
