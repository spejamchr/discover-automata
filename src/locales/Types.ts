import { stringLiteral } from '@execonline-inc/decoders';
import Decoder, { oneOf } from 'jsonous';
import { constrainTo } from '../Constrain';

export const locales = ['en'] as const;

export type Locale = typeof locales[number];

const localeDecoder: Decoder<Locale> = oneOf([stringLiteral('en')]);

export const constrainToLocale = constrainTo(localeDecoder);
